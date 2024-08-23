import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SignupScreen = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:80' : 'http://localhost:80';

  const signUp = async () => {
    setLoading(true);
    try {
      // Step 1: Register the user
      const response = await fetch(`${baseUrl}/rest/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName: name, lastName: "", email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      const userDataWithID = await response.json();
      const userID = userDataWithID.userID;

      // Step 2: Assign Client role
      const roleResponse = await fetch(`${baseUrl}/rest/user_role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID,
          role_id: "6CF003E850708543A597F8A5CC8EC9BF", // Role ID for Client
        }),
      });

      if (!roleResponse.ok) {
        throw new Error("Failed to assign role");
      }

      // Step 3: Save client details with userID
      const clientResponse = await fetch(`${baseUrl}/rest/client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID,
          email,
          password,
        }),
      });

      if (!clientResponse.ok) {
        throw new Error("Failed to save client details");
      }

      Alert.alert("Success", "You have successfully signed up!");
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    signUp();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up for an account✨</Text>
      <Text style={styles.subtitle}>Create your account by filling in the details below.</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputWrapper}>
          <Icon name="person" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrapper}>
          <Icon name="mail" size={20} color="#aaa" style={styles.inputIcon} />
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
        <View style={styles.inputWrapper}>
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

      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.signupButtonText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: 'white',
  },
  passwordInput: {
    flex: 1,
  },
  passwordIcon: {
    marginLeft: 10,
  },
  signupButton: {
    backgroundColor: '#ff4081',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SignupScreen;
