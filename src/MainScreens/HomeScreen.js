import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderBar from '../Components/HeaderBar';
import { Search } from '../Components/search.component';
import { SafeArea } from '../Components/safe_area.component';
import Catagories from '../Components/Catagories';
import OfferSliders from '../Components/OfferSliders';

const HomeScreen = () => {
    return (
        <SafeArea>
            <View style={styles.container}>
                <View style={styles.headerWrapper}>
                    <HeaderBar />
                </View>
                <View style={styles.searchWrapper}>
                    <Search />
                </View>
                <View>
                    <Catagories style={styles.categoriesWrapper}/>
                </View>
                <View style={styles.offerSlidersWrapper}>
                    <OfferSliders />
                </View>
            </View>
        </SafeArea>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    headerWrapper: {
        height: 90,
        backgroundColor: '#f8f8f8',
    },
    searchWrapper: {
        paddingHorizontal: 10,
        backgroundColor: '#ffebcd',
        paddingTop: 10,
        mariginTop: 10,
    },
    categoriesWrapper: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    offerSlidersWrapper: {
        paddingHorizontal: 10,
        paddingTop: 100,
    },
});

export default HomeScreen;