import React, { useContext, useEffect, useState,   } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Pressable, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { Icon } from '@rneui/themed';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Categories from '../components/Categories';
import ProductCard from '../components/ProductCard';
import { ip } from '../ip';
import CartContext from '../CartContext';
const PetAccessories = ({ navigation }) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const API = activeCategory === 'Dogs' ? 'dog' : (activeCategory === 'Cats' ? 'cat' : (activeCategory === 'fish' ? 'fish' : 'pet'));
  const {addToCart}=useContext(CartContext);
  const { addToWish, removeFromWish, items , list } = useContext(CartContext);
  const [wishlistStatus, setWishlistStatus] = useState({});
  // console.log(data);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${ip}:3000/api/${API}products`);
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [API]);
  const navigateToProductDescription = (product) => {
    
    navigation.navigate('ProductDescription', product);

  };
  const toggleWishlist = (itemId) => {
    setWishlistStatus((prevStatus) => {
      const updatedStatus = { ...prevStatus };
      updatedStatus[itemId] = !updatedStatus[itemId];
      return updatedStatus;
    });

    const item = allProducts.find((item) => item._id === itemId);

    if (wishlistStatus[itemId]) {
      removeFromWish(itemId);
    } else {
      addToWish(item);
    }
  };
  
  useEffect(() => {
    setWishlistStatus((prevStatus) => {
      const updatedStatus = { ...prevStatus };

      // Clear the status for items that are not in the wishlist
      Object.keys(updatedStatus).forEach((itemId) => {
        if (!list.find((item) => item._id === itemId)) {
          delete updatedStatus[itemId];
        }
      });

      return updatedStatus;
    });
  }, [list]);

 
  return (
    <SafeAreaView style={{flex: 1,backgroundColor: 'white',}}>
      <Navbar allProducts={allProducts}   navigation={navigation}/>
      
      <Banner />
      <Categories style={styles.Categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      <FlatList
        data={allProducts}
        keyExtractor={(item) => item._id}
        horizontal={false}
        numColumns={2}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => navigateToProductDescription(item)}>
            <ProductCard key={index} imageurl={item.imageurl} name={item.name} price={item.price} ratings={item.rating} add={item.add}  handleCart={() => addToCart(item)} actionButton={{
                icon: (
                  <TouchableOpacity onPress={() => toggleWishlist(item._id)}>
                    <Icon
                      name={wishlistStatus[item._id] ? "heart" : "hearto"}
                      type="antdesign"
                      color={wishlistStatus[item._id] ? "red" : "black"}
                      size={20}
                    />
                  </TouchableOpacity>
                ),
              }}/>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* <View style={styles.sortButtonsContainer}>
        <Pressable style={styles.sortButton}>
          <Icon name="filter" type="antdesign" color="black" size={20} containerStyle={{ zIndex: 1 }} />
          <Text style={styles.buttonText}>Filter</Text>
        </Pressable>
        <Pressable style={styles.sortButton}>
          <Icon name="swap-vert" type="material" color="black" size={25} containerStyle={{ zIndex: 1 }} />
          <Text style={styles.buttonText}>Sort</Text>
        </Pressable>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  Categories: {
    marginBottom: 0,
  },
  sortButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: 70,
    right: 0,
    alignItems: 'center',
  },
  sortButton: {
    backgroundColor: '#F3F6F7',
    borderRadius: 5,
    margin: 1,
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PetAccessories;
