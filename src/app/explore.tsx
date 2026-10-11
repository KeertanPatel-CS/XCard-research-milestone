import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Category = 'Dining' | 'Travel' | 'Groceries' | 'Gas';

type RewardCard = {
  id: string;
  name: string;
  lastFour: string;
  rates: Record<Category, number>;
};

type Scenario = {
  id: string;
  merchant: string;
  description: string;
  amount: number;
  category: Category;
};

const totalRounds = 5;

const cards: RewardCard[] = [
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

const scenarioBank: Scenario[] = [
  {
    id: 'coffee',
    merchant: 'Starbucks',
    description: 'Morning coffee with friends',
    amount: 24,
    category: 'Dining',
  },
  {
    id: 'flight',
    merchant: 'Delta Air Lines',
    description: 'A domestic flight',
    amount: 320,
    category: 'Travel',
  },
  {
    id: 'groceries',
    merchant: 'Kroger',
    description: 'Weekly grocery shopping',
    amount: 86,
    category: 'Groceries',
  },
  {
    id: 'fuel',
    merchant: 'Shell',
    description: 'A tank of gas',
    amount: 55,
    category: 'Gas',
  },
  {
    id: 'restaurant',
    merchant: 'Olive Garden',
    description: 'Dinner for two',
    amount: 72,
    category: 'Dining',
  },
  {
    id: 'hotel',
    merchant: 'Marriott',
    description: 'A one-night hotel stay',
    amount: 240,
    category: 'Travel',
  },
  {
    id: 'market',
    merchant: 'Whole Foods',
    description: 'Fresh groceries',
    amount: 110,
    category: 'Groceries',
  },
  {
    id: 'road-trip',
    merchant: 'Exxon',
    description: 'Fuel for a road trip',
    amount: 48,
    category: 'Gas',
  },
];

function createRoundSet() {
  return [...scenarioBank]
    .sort(() => Math.random() - 0.5)
    .slice(0, totalRounds);
}

function calculateRewards(
  card: RewardCard,
  scenario: Scenario,
) {
  return scenario.amount * (card.rates[scenario.category] / 100);
}

function findBestCard(scenario: Scenario) {
  return cards.reduce((bestCard, currentCard) => {
    const bestRewards = calculateRewards(bestCard, scenario);
    const currentRewards = calculateRewards(currentCard, scenario);

    return currentRewards > bestRewards ? currentCard : bestCard;
  });
}

export default function ChallengeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [rounds, setRounds] = useState(createRoundSet);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const scenario = rounds[roundIndex];
  const bestCard = findBestCard(scenario);
  const answered = selectedCardId !== null;
  const answerIsCorrect = selectedCardId === bestCard.id;

  function chooseCard(cardId: string) {
    if (answered) {
      return;
    }

    const correct = cardId === bestCard.id;
    setSelectedCardId(cardId);

    if (correct) {
      const newStreak = streak + 1;
      setScore((currentScore) => currentScore + 1);
      setStreak(newStreak);
      setBestStreak((currentBest) =>
        Math.max(currentBest, newStreak),
      );

      void Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      );
    } else {
      setStreak(0);

      void Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error,
      );
    }
  }

  function goToNextRound() {
    if (roundIndex === totalRounds - 1) {
      setFinished(true);
      return;
    }

    setRoundIndex((currentRound) => currentRound + 1);
    setSelectedCardId(null);
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
      });
  }

  function restartGame() {
    setRounds(createRoundSet());
    setRoundIndex(0);
    setSelectedCardId(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />

        <View style={styles.finishedContainer}>
          <Text style={styles.eyebrow}>CHALLENGE COMPLETE</Text>
          <Text style={styles.finalScore}>
            {score}/{totalRounds}
          </Text>
          <Text style={styles.finalTitle}>
            {score === totalRounds
              ? 'Rewards expert!'
              : score >= 3
                ? 'Great card instincts!'
                : 'Keep practicing!'}
          </Text>
          <Text style={styles.finalDescription}>
            Your longest correct-answer streak was {bestStreak}.
            Replay to receive a different mix of purchases.
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={restartGame}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              Play again
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>
              REWARDS CHALLENGE
            </Text>
            <Text style={styles.title}>
              Pick the best card
            </Text>
          </View>

          <View style={styles.scoreBadge}>
            <Text style={styles.scoreLabel}>SCORE</Text>
            <Text style={styles.scoreValue}>
              {score}/{totalRounds}
            </Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          {rounds.map((round, index) => (
            <View
              key={round.id}
              style={[
                styles.progressSegment,
                index <= roundIndex &&
                  styles.progressSegmentActive,
              ]}
            />
          ))}
        </View>

        <Text style={styles.roundLabel}>
          ROUND {roundIndex + 1} OF {totalRounds}
        </Text>

        <View style={styles.scenarioCard}>
          <Text style={styles.category}>
            {scenario.category.toUpperCase()}
          </Text>
          <Text style={styles.merchant}>
            {scenario.merchant}
          </Text>
          <Text style={styles.description}>
            {scenario.description}
          </Text>
          <Text style={styles.amount}>
            ${scenario.amount.toFixed(2)}
          </Text>
        </View>

        <Text style={styles.prompt}>
          Which card earns the most rewards?
        </Text>

        {cards.map((card) => {
          const selected = selectedCardId === card.id;
          const isBest = card.id === bestCard.id;

          return (
            <Pressable
              accessibilityRole="button"
              disabled={answered}
              key={card.id}
              onPress={() => chooseCard(card.id)}
              style={[
                styles.cardOption,
                selected &&
                  answerIsCorrect &&
                  styles.correctOption,
                selected &&
                  !answerIsCorrect &&
                  styles.incorrectOption,
                answered &&
                  isBest &&
                  styles.bestOption,
              ]}
            >
              <View style={styles.cardInformation}>
                <Text style={styles.cardName}>
                  {card.name}
                </Text>
                <Text style={styles.cardDetails}>
                  •••• {card.lastFour} ·{' '}
                  {card.rates[scenario.category]}%{' '}
                  {scenario.category}
                </Text>
              </View>

              {answered ? (
                <Text style={styles.rewardValue}>
                  $
                  {calculateRewards(
                    card,
                    scenario,
                  ).toFixed(2)}
                </Text>
              ) : (
                <Text style={styles.selectText}>SELECT</Text>
              )}
            </Pressable>
          );
        })}

        {answered ? (
          <View
            style={[
              styles.feedback,
              answerIsCorrect
                ? styles.correctFeedback
                : styles.incorrectFeedback,
            ]}
          >
            <Text style={styles.feedbackTitle}>
              {answerIsCorrect
                ? 'Correct!'
                : 'Not quite'}
            </Text>

            <Text style={styles.feedbackText}>
              {bestCard.name} earns{' '}
              <Text style={styles.highlight}>
                $
                {calculateRewards(
                  bestCard,
                  scenario,
                ).toFixed(2)}
              </Text>{' '}
              because it receives{' '}
              {bestCard.rates[scenario.category]}% back on{' '}
              {scenario.category.toLowerCase()} purchases.
            </Text>

            <Text style={styles.streak}>
              Current streak: {streak}
            </Text>
          </View>
        ) : null}

        {answered ? (
          <Pressable
            accessibilityRole="button"
            onPress={goToNextRound}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {roundIndex === totalRounds - 1
                ? 'See final score'
                : 'Next purchase'}
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const colors = {
  background: '#080806',
  panel: '#181611',
  panelStrong: '#211b10',
  border: '#3d3527',
  gold: '#d3a958',
  lightGold: '#f0cf83',
  text: '#f7f1e7',
  muted: '#aaa398',
  success: '#70bd78',
  successBackground: '#102116',
  danger: '#ef8177',
  dangerBackground: '#2b1312',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 130,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eyebrow: {
    color: colors.lightGold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
  },
  scoreBadge: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignItems: 'center',
  },
  scoreLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  scoreValue: {
    color: colors.lightGold,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 24,
  },
  progressSegment: {
    flex: 1,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 99,
  },
  progressSegmentActive: {
    backgroundColor: colors.gold,
  },
  roundLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginTop: 18,
  },
  scenarioCard: {
    backgroundColor: colors.panelStrong,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 20,
    padding: 22,
    marginTop: 10,
  },
  category: {
    color: colors.lightGold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  merchant: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '700',
    marginTop: 8,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 5,
  },
  amount: {
    color: colors.lightGold,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 20,
  },
  prompt: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 26,
    marginBottom: 12,
  },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  correctOption: {
    borderColor: colors.success,
    backgroundColor: colors.successBackground,
  },
  incorrectOption: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBackground,
  },
  bestOption: {
    borderColor: colors.success,
  },
  cardInformation: {
    flex: 1,
  },
  cardName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  cardDetails: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 5,
  },
  selectText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  rewardValue: {
    color: colors.lightGold,
    fontSize: 16,
    fontWeight: '800',
  },
  feedback: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 17,
    marginTop: 8,
  },
  correctFeedback: {
    backgroundColor: colors.successBackground,
    borderColor: colors.success,
  },
  incorrectFeedback: {
    backgroundColor: colors.dangerBackground,
    borderColor: colors.danger,
  },
  feedbackTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  feedbackText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  highlight: {
    color: colors.lightGold,
    fontWeight: '800',
  },
  streak: {
    color: colors.lightGold,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  primaryButton: {
    minHeight: 54,
    backgroundColor: colors.gold,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#171105',
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.75,
  },
  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  finalScore: {
    color: colors.lightGold,
    fontSize: 78,
    fontWeight: '800',
    letterSpacing: -4,
  },
  finalTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
    marginTop: 6,
  },
  finalDescription: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 12,
  },
});