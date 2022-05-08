import React ,  {useEffect , useState} from 'react';

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'

import { Restaurant, OrderDelivery } from './screens'
import Tabs from './navigation/tabs'

import messaging from '@react-native-firebase/messaging';

const Stack = createStackNavigator();

const App = () => {
  const [notification , setNotification] = useState({title: undefined , body: undefined});


  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('.............' , token);

  };


  useEffect(() => {
    getToken();
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      setNotification({
        title: remoteMessage.notification.title,

        body: remoteMessage.notification.body,
      });

    }); 

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('onNotificationOpenedApp: ' , JSON.stringify(remoteMessage));
      setNotification({
        title: remoteMessage.notification.title,

        body: remoteMessage.notification.body,
      });
    });

    messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          JSON.stringify(remoteMessage),
        );
        setNotification({
          title: remoteMessage.notification.title,
  
          body: remoteMessage.notification.body,
        });
       
      }
      
    });
}, []);
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={'Home'}
            >
                <Stack.Screen name="Home" component={Tabs} />
                <Stack.Screen name="Restaurant" component={Restaurant} />
                <Stack.Screen name="OrderDelivery" component={OrderDelivery} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;