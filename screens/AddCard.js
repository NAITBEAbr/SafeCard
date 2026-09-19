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
import { BarCodeScanner } from "expo-barcode-scanner";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../config";

export default class AddCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: "",
      codigo: "",
      tipoCodigo: "",
      lendo: false,
      temPermissao: null,
      salvando: false,
    };
  }

  abrirCamera = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({ temPermissao: status === "granted", lendo: status === "granted" });

    if (status !== "granted") {
      Alert.alert(
        "Sem acesso à câmera",
        "Autorize a câmera nas configurações do celular para ler o código."
      );
    }
  };

  handleCodigoLido = ({ type, data }) => {
    this.setState({ codigo: data, tipoCodigo: String(type), lendo: false });
  };

  handleSalvar = async () => {
    const { nome, codigo, tipoCodigo } = this.state;
    const usuario = auth.currentUser;

    if (!nome.trim()) {
      Alert.alert("Dê um nome ao cartão", "Por exemplo: Farmácia, Supermercado.");
      return;
    }
    if (!codigo.trim()) {
      Alert.alert("Falta o número", "Escaneie o código de barras ou digite o número.");
      return;
    }
    if (!usuario) {
      Alert.alert("Sessão expirada", "Entre de novo para salvar.");
      return;
    }

    this.setState({ salvando: true });
    try {
      await addDoc(collection(db, "cards"), {
        userId: usuario.uid,
        nome: nome.trim(),
        codigo: codigo.trim(),
        tipoCodigo: tipoCodigo || "manual",
        criadoEm: serverTimestamp(),
      });
      this.setState({ nome: "", codigo: "", tipoCodigo: "" });
      Alert.alert("Cartão salvo!");
      this.props.navigation.navigate("Meus cartões");
    } catch (erro) {
      Alert.alert("Não foi possível salvar", erro.message);
    } finally {
      this.setState({ salvando: false });
    }
  };

  render() {
    const { nome, codigo, lendo, salvando } = this.state;

    if (lendo) {
      return (
        <View style={styles.camera}>
          <BarCodeScanner
            onBarCodeScanned={this.handleCodigoLido}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.cameraRodape}>
            <Text style={styles.cameraTexto}>
              Aponte para o código de barras do cartão
            </Text>
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() => this.setState({ lendo: false })}
            >
              <Text style={styles.botaoTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Text style={styles.titulo}>Novo cartão</Text>

        <Text style={styles.rotulo}>Nome do cartão</Text>
        <TextInput
          style={styles.input}
          placeholder="Farmácia, supermercado, academia..."
          placeholderTextColor="#9C9C9C"
          value={nome}
          onChangeText={(texto) => this.setState({ nome: texto })}
        />

        <Text style={styles.rotulo}>Número do cartão</Text>
        <TextInput
          style={styles.input}
          placeholder="Escaneie ou digite o número"
          placeholderTextColor="#9C9C9C"
          keyboardType="numbers-and-punctuation"
          value={codigo}
          onChangeText={(texto) => this.setState({ codigo: texto })}
        />

        <TouchableOpacity style={styles.botaoSecundario} onPress={this.abrirCamera}>
          <Text style={styles.botaoSecundarioTexto}>Escanear código de barras</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botao, salvando && styles.botaoDesativado]}
          onPress={this.handleSalvar}
          disabled={salvando}
        >
          <Text style={styles.botaoTexto}>
            {salvando ? "Salvando..." : "Salvar cartão"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F4F8", padding: 24, paddingTop: 60 },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2F2C9E",
    marginBottom: 24,
  },
  rotulo: { fontSize: 14, color: "#555555", marginBottom: 6 },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: "#222222",
    marginBottom: 18,
  },
  botao: {
    backgroundColor: "#5653D4",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  botaoDesativado: { opacity: 0.6 },
  botaoTexto: { color: "#FFFFFF", fontSize: 17, fontWeight: "bold" },
  botaoSecundario: {
    borderWidth: 2,
    borderColor: "#5653D4",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  botaoSecundarioTexto: { color: "#5653D4", fontSize: 16, fontWeight: "bold" },
  camera: { flex: 1, backgroundColor: "#000000" },
  cameraRodape: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  cameraTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  botaoCancelar: {
    backgroundColor: "#5653D4",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
});
