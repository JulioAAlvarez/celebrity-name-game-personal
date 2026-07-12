import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonItem, IonText, IonList, IonLabel, IonChip } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

// Types (same as before)
interface Player {
  id: string;
  username: string;
  score: number;
  isHost: boolean;
  isReady: boolean;
}

interface Game {
  id: string;
  roomCode: string;
  currentName: string | null;
  hasStarted: boolean;
  players: Player[];
}

const Game: React.FC = () => {
  const location = useLocation<{ roomCode: string; username: string; isHost: boolean }>();
  const history = useHistory();
  const queryClient = useQueryClient();

  const { roomCode, username, isHost } = location.state || {};
  const [guess, setGuess] = useState('');
  const [nameToSet, setNameToSet] = useState('');

  // Redirect if no room data
  if (!roomCode || !username) {
    history.push('/home');
    return null;
  }

  // Fetch game state
  const { data: game, isLoading, refetch } = useQuery<Game>({
    queryKey: ['game', roomCode],
    queryFn: async () => {
      const response = await api.get(`/games/${roomCode}`);
      return response.data;
    },
    refetchInterval: 3000, // Poll every 3 seconds
  });

  // Set name mutation (for starting player)
  const setNameMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await api.post(`/games/${roomCode}/set-name`, {
        username,
        name,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game', roomCode] });
      setNameToSet('');
    },
  });

  // Guess mutation
  const guessMutation = useMutation({
    mutationFn: async (guess: string) => {
      const response = await api.post(`/games/${roomCode}/guess`, {
        username,
        guess,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game', roomCode] });
      setGuess('');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Invalid guess!');
    },
  });

  // Start game mutation (host only)
  const startGameMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/games/${roomCode}/start`, {
        username,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game', roomCode] });
    },
  });

  if (isLoading || !game) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonText>Loading game...</IonText>
        </IonContent>
      </IonPage>
    );
  }

  // Check for winner
  const winner = game.players.find(p => p.score >= 10000);
  if (winner) {
    const sorted = [...game.players].sort((a, b) => b.score - a.score);
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Game Over</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText>
            <h1>🏆 {sorted[0].username} wins!</h1>
            <h2>Gold: {sorted[0].username}</h2>
            {sorted[1] && <h3>Silver: {sorted[1].username}</h3>}
            {sorted[2] && <h3>Bronze: {sorted[2].username}</h3>}
          </IonText>
          <IonButton expand="block" onClick={() => history.push('/home')}>
            Back to Home
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  // Check if it's time to set the first name
  const needsNameSet = game.hasStarted && !game.currentName;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Room: {roomCode}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Current Name Display */}
        {game.currentName && (
          <IonText>
            <h1>Current Name</h1>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{game.currentName}</p>
          </IonText>
        )}

        {/* Scoreboard */}
        <IonText>
          <h2>Scores</h2>
        </IonText>
        <IonList>
          {game.players.map((p) => (
            <IonItem key={p.id}>
              <IonLabel>
                {p.username} {p.isHost && '👑'}
                {p.isReady && ' ✅'}
              </IonLabel>
              <IonChip color={p.score >= 10000 ? 'success' : 'medium'}>
                {p.score} points
              </IonChip>
            </IonItem>
          ))}
        </IonList>

        {/* Set First Name (starter only) */}
        {needsNameSet && (
          <>
            <IonText>
              <p>You are the starter! Set the first celebrity name.</p>
            </IonText>
            <IonItem>
              <IonInput
                value={nameToSet}
                placeholder="Enter the first name..."
                onIonInput={(e) => setNameToSet(e.detail.value ?? '')}
              />
            </IonItem>
            <IonButton
              expand="block"
              onClick={() => setNameMutation.mutate(nameToSet)}
              disabled={!nameToSet || setNameMutation.isPending}
            >
              {setNameMutation.isPending ? 'Setting...' : 'Set Name'}
            </IonButton>
          </>
        )}

        {/* Guess Input */}
        {game.hasStarted && game.currentName && (
          <>
            <IonText>
              <p>Enter a celebrity name that chains from the current name.</p>
            </IonText>
            <IonItem>
              <IonInput
                value={guess}
                placeholder="Enter your guess..."
                onIonInput={(e) => setGuess(e.detail.value ?? '')}
              />
            </IonItem>
            <IonButton
              expand="block"
              onClick={() => guessMutation.mutate(guess)}
              disabled={!guess || guessMutation.isPending}
            >
              {guessMutation.isPending ? 'Submitting...' : 'Submit Guess'}
            </IonButton>
          </>
        )}

        {/* Start Game Button (host only) */}
        {isHost && !game.hasStarted && (
          <IonButton
            expand="block"
            color="success"
            onClick={() => startGameMutation.mutate()}
            disabled={startGameMutation.isPending}
          >
            {startGameMutation.isPending ? 'Starting...' : 'Start Game'}
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Game;