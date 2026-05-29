import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Title } from '../components/Texts';
import { SimpleScreen } from '../components/Interface';
import type { ScreenNavigation } from '../components/Types';

type HomeNavigation = ScreenNavigation<{
    QRCode: undefined;
    ViewStatement: undefined;
    AddCredit: undefined;
}>;

export default function Home({ navigation }: { navigation: HomeNavigation }) {
    return (
        <SimpleScreen tabScreen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Title>Início</Title>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recomendação do dia</Text>

                    <View style={styles.authorRow}>
                        <View style={styles.textColumn}>
                            <Text style={styles.recipeName}>Shoyu lamen</Text>
                            <Text style={styles.tags}>#tags #tags #tags</Text>
                        </View>
                        {/* Imagem de perfil mockada via URL */}
                        <Image 
                            source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
                            style={styles.avatar} 
                        />
                    </View>

                    {/* Imagem da receita mockada via URL */}
                    <Image 
                        source={{ uri: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=600&auto=format&fit=crop' }} 
                        style={styles.recipeImage} 
                    />

                    <Text style={styles.footerText}>Receitas da família</Text>
                </View>

            </ScrollView>
        </SimpleScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginTop: 20,
        // Sombras para iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        // Sombras para Android
        elevation: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    authorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    textColumn: {
        flex: 1,
    },
    recipeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    tags: {
        fontSize: 13,
        color: '#888888',
        marginTop: 4,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EEEEEE', // fallback color
    },
    recipeImage: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: '#EEEEEE', // fallback color
    },
    footerText: {
        fontSize: 13,
        color: '#888888',
    }
});