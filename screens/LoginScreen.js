import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);
  const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:80' : 'http://localhost:80';

  const handleLogin = async () => {
    setLoading(true);
    try {
      const payload = {
        "username-4D": email,
        "password-4D": password,
      };

      // Step 1: Attempt to login the user
      const loginResponse = await fetch(`${baseUrl}/rest/$directory/login`, {
        method: 'POST',
        headers: payload,
      });

      if (!loginResponse.ok) {
        throw new Error('Failed to log in');
      }

      // Step 2: Get the user data
      const userResponse = await fetch(`${baseUrl}/rest/user?$filter="email=:1 AND password=:2"&$params='["${email}", "${password}"]'`);
      const user = (await userResponse.json()).__ENTITIES[0];
      const userID = user.userID;

      // Step 3: Check the user roles
      const roleResponse = await fetch(`${baseUrl}/rest/user_role?$filter="userID=${userID}"`);
      const roles = (await roleResponse.json()).__ENTITIES;

      // Step 4: Check if the user has the Client role
      const isClient = roles.some(role => role.role_id === '6CF003E850708543A597F8A5CC8EC9BF');

      if (isClient) {
        Alert.alert('Success', 'Login successful');
        console.log("userID dans page login",userID);
        // Navigate to client dashboard or home screen
        navigation.navigate('Featured', { userID });
      } else {
        Alert.alert('Error', 'You do not have the required role to log in');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in to your account✨</Text>
      <Text style={styles.subtitle}>Welcome back! Please enter your details.</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.emailContainer}>
          <Icon name="mail" size={20} color="#aaa" style={styles.emailIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Icon name="eye-off" size={20} color="#aaa" style={styles.passwordIcon} />
        </View>
      </View>

      <View style={styles.rememberContainer}>
        <Text style={styles.rememberText}>Remember for 30 days</Text>
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Log In'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#DB4437' }]}>
        <Text style={styles.socialButtonText}>Log in with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#3B5998' }]}>
        <Text style={styles.socialButtonText}>Log in with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  emailIcon: {
    marginRight: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
  },
  passwordIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: 'white',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberText: {
    color: 'white',
    marginLeft: 10,
  },
  forgotText: {
    color: '#bbb',
    marginLeft: 'auto',
  },
  loginButton: {
    backgroundColor: '#ff4081',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialButton: {
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
