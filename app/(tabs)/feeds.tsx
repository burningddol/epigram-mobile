import { SafeAreaView } from 'react-native-safe-area-context';

import { EpigramFeed } from '~/widgets/epigram-feed';

export default function FeedsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <EpigramFeed />
    </SafeAreaView>
  );
}
