export default class SafeCard extends Component {
    render () {
    return (
    <View style={styles.Menu}>
     <View style={styles.Configurações}>
      <View style={styles.authorNameCard}>
       <Text style={styles.authorNameText}>
          {this.state.post.author}
       </Text>
      </View>
      <View style={styles.capital}>
         <Text style={styles.capitalText}>
           {this.props.post.capital}
         </Text>
        </View>
       </View>
      </View>
     );
    } 
 }
 const styles = StyleSheet.create({
    Menu:{
     flex: 1,
   },
   Configurações: {
     margin: 10,
     backgroundColor: "white",
     borderRadius: 10,
     padding: 15,
   },
   authorNameCard: {
     flex: 0.85,
     justifyContent: 'center',
   },
   authorNameText: {
     fontsize: 20
   },
   capitalText: {
     paddingTop: 10,
   }
   });