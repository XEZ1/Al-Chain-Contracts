import { StyleSheet } from 'react-native';

const SharedStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 44,
    width: 250,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    paddingLeft: 12,
  },
  button: {
    height: 44,
    width: 250,
    backgroundColor: 'rgba(1, 193, 219, 0.8)',
    marginBottom: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'rgb(57, 63, 67)',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SharedStyles;
