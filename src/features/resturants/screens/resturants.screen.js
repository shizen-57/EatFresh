import React from "react";
import { SafeAreaView, StatusBar as RNStatusBar, StyleSheet, Text, View, Platform } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { ResturantInfo, ResturantInfoCard } from "../components/resturant_info_card.component";

export const ResturantsScreen = () => {
    const [search, setSearch] = React.useState('');

    return (
        <SafeAreaView style={{ flex: 1, marginTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 }}>
            <View style={styles.search}>
                <Searchbar
                    placeholder='Search'
                    value={search}
                    onChangeText={text => setSearch(text)}  // Update state when text changes
                />
            </View>

            <View style={{
                flex: 1,
                padding: 16,
                backgroundColor: 'blue',
            }}>
                <ResturantInfoCard/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    search: {
        padding: 16,
        backgroundColor: 'white'
    }
});
