import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import Barcode from "react-native-barcode-svg";
import { deleteDoc, doc } from "firebase/firestore";

import { db } from "../config";

export default class CardDetail extends Component {
  handleExcluir = () => {
    const { cartao } = this.props.route.params;

    Alert.alert(
      "Excluir cartão",
      `Tem certeza que quer excluir "${cartao.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "cards", cartao.id));
              this.props.navigation.goBack();
            } catch (erro) {
              Alert.alert("Não foi possível excluir", erro.message);
            }
          },
        },
      ]
    );
  };

  render() {
    const { cartao } = this.props.route.params;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.nome}>{cartao.nome}</Text>

        <View style={styles.codigoArea}>
          <Barcode value={cartao.codigo} format="CODE128" maxWidth={300} />
          <Text style={styles.numero}>{cartao.codigo}</Text>
        </View>

        <Text style={styles.dica}>
          Mostre este código no caixa. Se o leitor não pegar, aumente o brilho da tela
          ou diga o número.
        </Text>

        <TouchableOpacity style={styles.botaoExcluir} onPress={this.handleExcluir}>
          <Text style={styles.botaoExcluirTexto}>Excluir cartão</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F4F8",
    padding: 24,
    paddingTop: 60,
  },
  voltar: { fontSize: 17, color: "#5653D4", marginBottom: 20 },
  nome: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2F2C9E",
    marginBottom: 30,
    textAlign: "center",
  },
  codigoArea: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 30,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  numero: {
    fontSize: 18,
    letterSpacing: 2,
    color: "#222222",
    marginTop: 18,
  },
  dica: {
    fontSize: 14,
    color: "#777777",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 20,
  },
  botaoExcluir: {
    borderWidth: 2,
    borderColor: "#C62828",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 40,
  },
  botaoExcluirTexto: { color: "#C62828", fontSize: 16, fontWeight: "bold" },
});
