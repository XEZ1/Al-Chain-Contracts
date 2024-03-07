import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

function EditorScreen({ navigation }) {
  const { filePath } = navigation.params;
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    // Assuming readSolFileContent is an async function that reads the file content
    const loadFileContent = async () => {
      const content = await readSolFileContent(filePath);
      setFileContent(content);
    };

    loadFileContent();
  }, [filePath]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.editor}
        multiline
        editable
        value={fileContent}
        onChangeText={setFileContent} // Allows editing, remove if read-only
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  editor: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    textAlignVertical: 'top', // Align text to the top on Android
  },
});

export default EditorScreen;
