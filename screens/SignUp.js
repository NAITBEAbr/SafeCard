import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../config";
import { traduzErro } from "./Login";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmacao: "",
      carregando: false,
    };
  }

  handleSignUp = async () => {
    const { email, password, confirmacao } = this.state;

    if (!email.trim() || !password) {
      Alert.alert("Preencha o e-mail e a senha");
      return;
    }
    if (password.length < 6) {
      Alert.alert("A senha precisa ter pelo menos 6 caracteres");
      return;
    }
    if (password !== confirmacao) {
      Alert.alert("As senhas não são iguais");
      return;
    }

    this.setState({ carregando: true });
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      this.props.navigation.replace("BottomTab");
    } catch (error) {
      Alert.alert("Não foi possível cadastrar", traduzErro(error.code));
    } finally {
      this.setState({ carregando: false });
    }
  };

  render() {
    const { email, password, confirmacao, carregando } = this.state;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.titulo}>Criar conta</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#9C9C9C"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(texto) => this.setState({ email: texto })}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#9C9C9C"
            secureTextEntry
            value={password}
            onChangeText={(texto) => this.setState({ password: texto })}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirme a senha"
            placeholderTextColor="#9C9C9C"
            secureTextEntry
            value={confirmacao}
            onChangeText={(texto) => this.setState({ confirmacao: texto })}
          />

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesativado]}
            onPress={this.handleSignUp}
            disabled={carregando}
          >
            <Text style={styles.botaoTexto}>
              {carregando ? "Criando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.link}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#5653D4", justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 30 },
  titulo: { fontSize: 32, fontWeight: "bold", color: "#FFFFFF" },
  form: { paddingHorizontal: 30 },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    color: "#222222",
  },
  botao: {
    backgroundColor: "#2F2C9E",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 6,
  },
  botaoDesativado: { opacity: 0.6 },
  botaoTexto: { color: "#FFFFFF", fontSize: 17, fontWeight: "bold" },
  link: { color: "#FFFFFF", textAlign: "center", marginTop: 20, fontSize: 15 },
});
