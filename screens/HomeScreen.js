import React from 'react';

export default function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Sign out" onPress={() => console.log('sign out')} />
    </View>
  );
}
