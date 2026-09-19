import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { auth, db } from "../config";

export default class CardList extends Component {
  constructor(props) {
    super(props);
    this.state = { cartoes: [], busca: "", carregando: true };
    this.cancelarEscuta = null;
  }

  componentDidMount() {
    const usuario = auth.currentUser;
    if (!usuario) {
      this.setState({ carregando: false });
      return;
    }

    // onSnapshot mantém a lista atualizada sozinha: ao adicionar ou excluir
    // um cartão, esta tela recebe a mudança na hora.
    const consulta = query(
      collection(db, "cards"),
      where("userId", "==", usuario.uid)
    );

    this.cancelarEscuta = onSnapshot(
      consulta,
      (resultado) => {
        const cartoes = resultado.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        cartoes.sort((a, b) => a.nome.localeCompare(b.nome));
        this.setState({ cartoes, carregando: false });
      },
      (erro) => {
        this.setState({ carregando: false });
        Alert.alert("Não foi possível carregar os cartões", erro.message);
      }
    );
  }

  componentWillUnmount() {
    if (this.cancelarEscuta) {
      this.cancelarEscuta();
    }
  }

  handleSair = async () => {
    await signOut(auth);
    this.props.navigation.getParent().replace("Login");
  };

  cartoesFiltrados = () => {
    const { cartoes, busca } = this.state;
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      return cartoes;
    }
    return cartoes.filter(
      (cartao) =>
        cartao.nome.toLowerCase().includes(termo) ||
        cartao.codigo.includes(termo)
    );
  };

  renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cartao}
      onPress={() =>
        // só os campos simples: a data vem como Timestamp do Firestore e a
        // navegação avisa quando recebe valor que não é serializável.
        this.props.navigation.getParent().navigate("CardDetail", {
          cartao: { id: item.id, nome: item.nome, codigo: item.codigo },
        })
      }
    >
      <View style={styles.cartaoInfo}>
        <Text style={styles.cartaoNome}>{item.nome}</Text>
        <Text style={styles.cartaoCodigo}>{item.codigo}</Text>
      </View>
      <Text style={styles.seta}>›</Text>
    </TouchableOpacity>
  );

  render() {
    const { busca, carregando, cartoes } = this.state;

    if (carregando) {
      return (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#5653D4" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.topo}>
          <Text style={styles.titulo}>Meus cartões</Text>
          <TouchableOpacity onPress={this.handleSair}>
            <Text style={styles.sair}>Sair</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.busca}
          placeholder="Buscar por nome ou número"
          placeholderTextColor="#9C9C9C"
          value={busca}
          onChangeText={(texto) => this.setState({ busca: texto })}
        />

        {cartoes.length === 0 ? (
          <View style={styles.centro}>
            <Text style={styles.vazio}>Você ainda não tem cartões.</Text>
            <Text style={styles.vazioDica}>
              Use a aba Adicionar para cadastrar o primeiro.
            </Text>
          </View>
        ) : (
          <FlatList
            data={this.cartoesFiltrados()}
            keyExtractor={(item) => item.id}
            renderItem={this.renderItem}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={
              <Text style={styles.vazio}>Nenhum cartão encontrado.</Text>
            }
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F4F8", paddingTop: 50 },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 },
  topo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#2F2C9E" },
  sair: { fontSize: 15, color: "#5653D4" },
  busca: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#222222",
    marginBottom: 10,
  },
  lista: { padding: 20 },
  cartao: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 5,
    borderLeftColor: "#5653D4",
  },
  cartaoInfo: { flex: 1 },
  cartaoNome: { fontSize: 18, fontWeight: "bold", color: "#222222" },
  cartaoCodigo: { fontSize: 14, color: "#777777", marginTop: 4 },
  seta: { fontSize: 28, color: "#9C9C9C" },
  vazio: { fontSize: 16, color: "#555555", textAlign: "center" },
  vazioDica: { fontSize: 14, color: "#888888", marginTop: 8, textAlign: "center" },
});
