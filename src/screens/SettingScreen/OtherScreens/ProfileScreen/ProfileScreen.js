// ProfileScreen.js
import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

const ProfileScreen = () => {
  const user = useSelector(state => state.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ProfileScreen</Text>
      <Text style={styles.info}>Name: {user.name || 'N/A'}</Text>
      <Text style={styles.info}>Email: {user.email || 'N/A'}</Text>
      {user.imageUri ? (
        <Image source={{uri: user.imageUri}} style={styles.profileImage} />
      ) : (
        <Text style={styles.info}>No Image Available</Text>
      )}
      {/* Display other user fields as needed */}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  info: {
    fontSize: 18,
    marginBottom: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 16,
  },
});
