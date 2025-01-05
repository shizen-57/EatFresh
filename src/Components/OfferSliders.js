import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const offers = [
    {
        id: 1,
        image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2FBurgerXpressbd%2Fposts%2Foffer-alert-hello-foodies-50-discount-going-ononly-at-hungrynakienjoy-the-depth-%2F1313766082458248%2F&psig=AOvVaw21Dy_BgqIx_yvrfYlDorAN&ust=1736197129086000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKDF3Li834oDFQAAAAAdAAAAABAS',
        description: '50% off on all pizzas!',
    },
    {
        id: 2,
        image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2FEuphoriaDhanmondi%2Fposts%2Fbuy-1-get-1-free-offer-is-backthis-offer-is-available-in-banani-dhanmondi-and-ut%2F353404315385188%2F&psig=AOvVaw3N16gMSPl5QT6TUkorcK_c&ust=1736197175610000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKjWy86834oDFQAAAAAdAAAAABAT',
        description: 'Buy 1 Get 1 Free on all burgers!',
    },
    {
        id: 3,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpmqJeUDp9ZhZ2gaVgKwHKKzHbBobx-UNRnw&s',
        description: 'Free dessert with every main course!',
    },
];

const OfferSliders = () => {
    return (
        <View style={styles.container}>
            <Swiper showsPagination={true} autoplay={true} autoplayTimeout={3}>
                {offers.map((offer) => (
                    <View key={offer.id} style={styles.slide}>
                        <Image source={{ uri: offer.image }} style={styles.image} />
                        <Text style={styles.text}>{offer.description}</Text>
                    </View>
                ))}
            </Swiper>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    image: {
        width: '100%',
        height: '70%',
        resizeMode: 'cover',
    },
    text: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default OfferSliders;