import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function TrackBar({ months, completed }) {
  const { colors: c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {Array.from({ length: months }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i < completed ? c.accent : c.divider,
          }}
        />
      ))}
    </View>
  );
}
