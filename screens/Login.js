import React from 'react';
import {View, Text, ImageBackground, StyleSheet, Image, TouchableOpacity, Alert, KeyboardAvoidingView} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

const bgImage = require("../assets/background1.png");
const appIcon = require("../assets/Icon.png");
const appName = require("../assets/favicon.png");

export default class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    handleLogin=(email,password)=>{
        const auth = getAuth();
        signInWithEmailAndPassword(auth,email,password)
        .then((userCredential)=>{
            this.props.navigation.navigate("BottomTab");
        })
        .catch(error=>{
            Alert.alert(error.message);
        });
    }
    render(){
        const {email, password} = this.state;
        return(
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <ImageBackground source={bgImage} style={styles.bgImage}>
                    <View style={styles.upperContainer}>
                        <Image source={appIcon} style={styles.appIcon} />
                        <Image source={appName} style={styles.appName} />
                    </View>
                    <View style={styles.lowerContainer}>
                        <View style={styles.textInputContainer}>
                            <TextInput style={styles.textInput}
                            onChangeText={text=>this.setState({email:text})}
                            placeholder={'E-mail'}
                            placeholderTextColor={"#FFFFFF"}
                            autoFocus />
                             <TextInput style={[styles.textInput, {marginTop:20}]}
                            onChangeText={text=>this.setState({password:text})}
                            placeholder={'Senha'}
                            placeholderTextColor={"#FFFFFF"}
                            secureTextEntry />
                            <TouchableOpacity style={[styles.button,{marginTop:20}]}
                            onPress={()=>this.handleLogin(email,password)} >
                                <Text style={styles.buttonText}>Entrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#FFFFFF"
    },
    bgImage:{
        flex:1,
        resizeMode:"cover",
        justifyContent:"center"
    },
    upperContainer:{
        flex:0.5,
        justifyContent:"center",
        alignItems:"center"
    },
    appIcon:{
        width:280,
        height:280,
        resizeMode:"contain",
        marginTop:80
    },
    appName:{
        width:130,
        height:130,
        resizeMode:"contain"
    },
    lowerContainer:{
        flex:0.5,
        alignItems:"center"
    },
    textInput:{
        width:300,
        height:55,
        padding:10,
        borderColor:"#FFFFFF",
        borderWidth:4,
        borderRadius:10,
        fontSize:18,
        color:"#FFFFFF",
        backgroundColor:"#5653D4"
    },
    button:{
        width:100,
        height:55,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#F48D20",
        borderRadius:15
    },
    buttonText:{
        fontSize:24,
        color:"#FFFFFF"
    },
    loginBox:{
        width:300,
        height:40,
        borderWidth:1.5,
        fontSize:20,
        margin:10,
        paddingLeft:10
    }
});