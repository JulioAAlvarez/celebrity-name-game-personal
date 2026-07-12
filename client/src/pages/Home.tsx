import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonText,
  IonList,
  IonLabel,
  IonChip,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';

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

const Home: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState('');

  const createGameMutation = useMutation({
    mutationFn: async () => {
      const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const response = await api.post('/games', { roomCode: newRoomCode, username });
      return response.data;
    },
    onSuccess: (data) => {
      setCreatedRoomCode(data.roomCode);
      setRoomCode(data.roomCode);
      history.push('/game', { roomCode: data.roomCode, username, isHost: true });
    },
    onError: () => {
      alert('Failed to create room. Please try again.');
    },
  });

  const joinGameMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/games/${roomCode}/join`, { username });
      return response.data;
    },
    onSuccess: (data) => {
      history.push('/game', { roomCode, username, isHost: false });
    },
    onError: () => {
      alert('Failed to join room. Please check the room code and try again.');
    },
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Celebrity Name Chain</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonText>
              <h2>Celebrity Name Chain</h2>
              <p>Enter a username, then create or join a room.</p>
            </IonText>

            <IonItem>
              <IonInput
                label="Username"
                labelPlacement="stacked"
                value={username}
                placeholder="Enter your username"
                onIonInput={(e) => setUsername(e.detail.value ?? '')}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Room Code"
                labelPlacement="stacked"
                value={roomCode}
                placeholder="Enter room code to join"
                onIonInput={(e) => setRoomCode(e.detail.value?.toUpperCase() ?? '')}
              />
            </IonItem>

            <IonButton
              expand="block"
              onClick={() => createGameMutation.mutate()}
              disabled={!username || createGameMutation.isPending}
            >
              {createGameMutation.isPending ? 'Creating...' : 'Create Room'}
            </IonButton>

            <IonButton
              expand="block"
              color="secondary"
              onClick={() => joinGameMutation.mutate()}
              disabled={!username || !roomCode || joinGameMutation.isPending}
            >
              {joinGameMutation.isPending ? 'Joining...' : 'Join Room'}
            </IonButton>

            {createdRoomCode && (
              <IonItem lines="none">
                <IonText>
                  <p>Your room code: <strong>{createdRoomCode}</strong></p>
                </IonText>
              </IonItem>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;