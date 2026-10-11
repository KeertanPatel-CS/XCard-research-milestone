import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Category = 'Dining' | 'Travel' | 'Groceries' | 'Gas';

type RewardCard = {
  id: string;
  name: string;
  lastFour: string;
  rates: Record<Category, number>;
};

type CardResult = RewardCard & {
  rate: number;
  rewards: number;
};

const categories: Category[] = [
  'Dining',
  'Travel',
  'Groceries',
  'Gas',
];

const sampleCards: RewardCard[] = [
  {
    id: 'amber',
    name: 'Amber Dining+',
    lastFour: '4821',
    rates: {
      Dining: 4,
      Travel: 2,
      Groceries: 1,
      Gas: 1,
    },
  },
  {
    id: 'horizon',
    name: 'Horizon Travel',
    lastFour: '1190',
    rates: {
      Dining: 2,
      Travel: 3,
      Groceries: 1,
      Gas: 1,
    },
  },
  {
    id: 'everyday',
    name: 'EveryDay Cash',
    lastFour: '7734',
    rates: {
      Dining: 2,
      Travel: 1,
      Groceries: 5,
      Gas: 3,
    },
  },
];

export default function HomeScreen() {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Dining');
  const [results, setResults] = useState<CardResult[]>([]);
  const [error, setError] = useState('');

  function compareCards() {
    const purchaseAmount = Number(amount.replace(/[$,\s]/g, ''));

    if (!Number.isFinite(purchaseAmount) || purchaseAmount <= 0) {
      setError('Enter a purchase amount greater than $0.');
      setResults([]);
      return;
    }

    const comparison = sampleCards
      .map((card) => {
        const rate = card.rates[category];

        return {
          ...card,
          rate,
          rewards: purchaseAmount * (rate / 100),
        };
      })
      .sort((a, b) => b.rewards - a.rewards);

    setError('');
    setResults(comparison);
  }

  const bestCard = results[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>XCARD RESEARCH LAB</Text>
        <Text style={styles.title}>Find the best card</Text>
        <Text style={styles.subtitle}>
          Compare sample reward rules before making a purchase.
        </Text>

        <View style={styles.panel}>
          <Text style={styles.label}>MERCHANT</Text>
          <TextInput
            value={merchant}
            onChangeText={setMerchant}
            placeholder="Example: Starbucks"
            placeholderTextColor="#777168"
            style={styles.input}
          />

          <Text style={styles.label}>PURCHASE AMOUNT</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="$0.00"
            placeholderTextColor="#777168"
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <Text style={styles.label}>SPENDING CATEGORY</Text>
          <View style={styles.categories}>
            {categories.map((option) => {
              const selected = option === category;

              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    setCategory(option);
                    setResults([]);
                  }}
                  style={[
                    styles.category,
                    selected && styles.selectedCategory,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selected && styles.selectedCategoryText,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={compareCards}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.buttonText}>Compare cards</Text>
          </Pressable>
        </View>

        {bestCard ? (
          <View style={styles.results}>
            <Text style={styles.sectionLabel}>RECOMMENDATION</Text>

            <View style={styles.bestCard}>
              <Text style={styles.bestFor}>
                BEST FOR {category.toUpperCase()}
              </Text>

              <Text style={styles.bestCardName}>{bestCard.name}</Text>

              <Text style={styles.explanation}>
                Use this card at {merchant.trim() || 'this merchant'} to earn
                approximately{' '}
                <Text style={styles.gold}>
                  ${bestCard.rewards.toFixed(2)}
                </Text>
                .
              </Text>

              <Text style={styles.rate}>{bestCard.rate}% back</Text>
            </View>

            <Text style={styles.sectionLabel}>CARD COMPARISON</Text>

            {results.map((card, index) => (
              <View key={card.id} style={styles.resultRow}>
                <Text style={styles.rank}>{index + 1}</Text>

                <View style={styles.cardInformation}>
                  <Text style={styles.cardName}>{card.name}</Text>
                  <Text style={styles.cardDetails}>
                    •••• {card.lastFour} · {card.rate}% {category}
                  </Text>
                </View>

                <Text style={styles.reward}>
                  ${card.rewards.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.information}>
            <Text style={styles.informationTitle}>How it works</Text>
            <Text style={styles.informationText}>
              XCard applies each card’s stored reward rate to the same
              purchase and ranks the estimated results.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const colors = {
  background: '#080806',
  panel: '#181611',
  border: '#3d3527',
  gold: '#d3a958',
  lightGold: '#f0cf83',
  text: '#f7f1e7',
  muted: '#aaa398',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 50,
  },
  eyebrow: {
    color: colors.lightGold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 18,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
    marginBottom: 24,
  },
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    backgroundColor: '#0e0d0a',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text,
    fontSize: 17,
    paddingHorizontal: 14,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  category: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selectedCategory: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  categoryText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: '#171105',
  },
  error: {
    color: '#ef8177',
    fontSize: 14,
    marginTop: 14,
  },
  button: {
    minHeight: 54,
    backgroundColor: colors.gold,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#171105',
    fontSize: 16,
    fontWeight: '800',
  },
  results: {
    marginTop: 28,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginTop: 18,
    marginBottom: 10,
  },
  bestCard: {
    backgroundColor: '#211b10',
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  bestFor: {
    color: colors.lightGold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  bestCardName: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    marginTop: 9,
  },
  explanation: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  gold: {
    color: colors.lightGold,
    fontWeight: '800',
  },
  rate: {
    alignSelf: 'flex-start',
    color: colors.lightGold,
    backgroundColor: '#382a0f',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 15,
    fontWeight: '700',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 9,
  },
  rank: {
    color: colors.lightGold,
    fontSize: 16,
    fontWeight: '800',
    width: 24,
    textAlign: 'center',
  },
  cardInformation: {
    flex: 1,
  },
  cardName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  cardDetails: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  reward: {
    color: colors.lightGold,
    fontSize: 16,
    fontWeight: '800',
  },
  information: {
    borderColor: colors.border,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 18,
    marginTop: 22,
  },
  informationTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  informationText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
});