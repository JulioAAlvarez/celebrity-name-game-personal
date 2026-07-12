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
  IonCard,
  IonCardContent,
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';

const Home: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState('');

  // Test API connection
  const testApi = async () => {
    try {
      const response = await api.get('/test');
      console.log('API test response:', response.data);
      alert('API is working!');
    } catch (error) {
      console.error('API test error:', error);
      alert('API is not reachable. Check console for details.');
    }
  };

  const testFetch = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/test');
      const data = await response.json();
     console.log('Fetch test:', data);
      alert('Fetch worked!');
      } catch (error) {
        console.error('Fetch error:', error);
    }
  };

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
    onError: (error: any) => {
      console.error('Create room error:', error);
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
    onError: (error: any) => {
      console.error('Join room error:', error);
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

            <IonButton
              expand="block"
              color="warning"
              onClick={testApi}
            >
              Test API Connection
            </IonButton>

            <IonButton expand="block" color="tertiary" onClick={testFetch}>
              Test Fetch
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