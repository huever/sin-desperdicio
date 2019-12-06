import React, { useState } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Text,
  View,
} from 'react-native';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';


class SignInScreen extends React.Component {

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
  };

  updateText = (text) => {
    this.setState({errorMessage: text})
  }

  constructor() {
    super();
    this.state = {
      user: '',
      password: '',
      errorMessage: ''
    }
  }

  onChangeText(text, field) {
    if (field == 'name') {
      this.setState({
        name: text
      })
    } else if (field == 'password') {
      this.setState({
        password: text
      })
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          
          <Image
            source={require('../assets/images/logo.png')}
            style={{width: 150, height: 150, marginTop: 100}}
          />

          <TextInput
            style={styles.textInput}
            placeholder="Usuario"
            onChangeText={text => this.onChangeText(text, 'name')}
          />

          <TextInput
            style={styles.textInput}
            placeholder="Contraseña"
            onChangeText={text => this.onChangeText(text, 'password')}
            secureTextEntry={true} 
          />

          <Button style={styles.btn} title="Iniciar sesión" onPress={this.submit} />
          <Button style={styles.btn} title="Registrar" onPress={this.register} />
          
          <Text style={styles.error}>
            {this.state.errorMessage}
          </Text>

        </View>
      </ScrollView>
    );
  }

  register = async () => {
    this.props.navigation.navigate('Register');
  }

  submit = async () => {

    let collection = {}
    collection.username = this.state.name,
    collection.password = this.state.password

    var url = 'http://192.168.0.13:9000/api/authenticate';
    var store = await AsyncStorage;

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(collection), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .catch(error => console.warn('Error:', error))
      .then(response => {
        console.warn(response)
        if (response.status == 400) {
          this.updateText(response.message)
        } else if (response.status == 401) {
          this.updateText(response.detail)
        } else {
          store.setItem('userToken', response.id_token)
          this.props.navigation.navigate('App');      
        }
      })
  };
}

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Registro',
  };

  updateText = (text) => {
    this.setState({errorMessage: text})
  }

  constructor() {
    super();
    this.state = {
      name: '',
      lastname: '',
      user: '',
      email: '',
      password: '',
      errorMessage: ''
    }
  }

  onChangeText(text, field) {
    if (field == 'name') {
      this.setState({
        name: text
      })
    } else if (field == 'lastname') {
      this.setState({
        lastname: text
      })
    } else if (field == 'user') {
      this.setState({
        user: text
      })
    } else if (field == 'email') {
      this.setState({
        email: text
      })
    } else if (field == 'password') {
      this.setState({
        password: text
      })
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          
          <Text style={styles.title}>
            Ingrese sus datos
          </Text>

          <TextInput
            style={styles.textInput}
            placeholder="Nombre"
            onChangeText={text => this.onChangeText(text, 'name')}
          />

          <TextInput
            style={styles.textInput}
            placeholder="Apellido"
            onChangeText={text => this.onChangeText(text, 'lastname')}
          />

          <TextInput
            style={styles.textInput}
            placeholder="Email"
            onChangeText={text => this.onChangeText(text, 'email')}
          />

          <TextInput
            style={styles.textInput}
            placeholder="Usuario"
            onChangeText={text => this.onChangeText(text, 'user')}
          />

          <TextInput
            style={styles.textInput}
            placeholder="Contraseña"
            onChangeText={text => this.onChangeText(text, 'password')}
            secureTextEntry={true} 
          />

          <Button style={styles.btn} title="Registrar" onPress={this.submit} />
          <Button style={styles.btn} title="Volver" onPress={this.goBack} />
          
          <Text style={styles.error}>
            {this.state.errorMessage}
          </Text>

        </View>
      </ScrollView>
    );
  }

  goBack = async () => {
    this.props.navigation.navigate('Auth');
  }

  submit = async () => {
    // UserDTO{login='huevo', firstName='null', lastName='null', email='huever@gmail.com', 
    // imageUrl='null', activated=false, langKey='es', createdBy=null, createdDate=null, 
    // lastModifiedBy='null', lastModifiedDate=null, authorities=null}} 

    let collection = {}
    collection.firstName = this.state.name,
    collection.lastName = this.state.lastname
    collection.login = this.state.user
    collection.password = this.state.password
    collection.email = this.state.email

    var url = 'http://192.168.0.13:9000/api/register';
    
    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(collection), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .catch(error => console.warn('Error:', error))
      .then(response => {
        console.warn(response)
        if (response.status == 400) {
          this.updateText(response.message)
        } else if (response.status == 401) {
          this.updateText(response.detail)
        } else if (response.status == 201) {
          console.warn(response)
        }
      })
  };
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Bienvenido!',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Show me more of the app" onPress={this._showMoreApp} />
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class OtherScreen extends React.Component {
  static navigationOptions = {
    title: 'Lots of features here',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="I'm done, sign me out" onPress={this._signOutAsync} />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 30
  },
  textInput: {
    height: 40, 
    width: 250, 
    borderColor: 'gray', 
    borderWidth: 1, 
    marginTop: 10,
    borderRadius: 3
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    marginTop: 10,
    backgroundColor: 'grey',
    height: 150,
    width: 150,
    borderColor: 'grey',
    borderWidth: 1
  },
  error: {
    fontSize: 15,
    color: 'red',
    marginTop: 30
  }
});

const AppStack = createStackNavigator({ Home: HomeScreen, Other: MainTabNavigator });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });
const RegisterStack = createStackNavigator({ SignIn: RegisterScreen });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Register: RegisterStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));