import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';

type StepProgressProps = {
  currentStep: number;
  totalSteps?: number;
};

export default function StepProgress({
  currentStep,
  totalSteps = 3,
}: StepProgressProps) {
  return (
    <View>
      <Text style={styles.text}>
        Step {currentStep} of {totalSteps}
      </Text>

      <View style={styles.container}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const active = index < currentStep;

          return (
            <View
              key={index}
              style={[
                styles.segment,
                active && styles.activeSegment,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },

  container: {
    flexDirection: 'row',
    gap: 6,
  },

  segment: {
    flex: 1,
    height: 4,
    borderRadius: 10,
    backgroundColor: Colors.border,
  },

  activeSegment: {
    backgroundColor: Colors.primary,
  },
});