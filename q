[1mdiff --git a/ASACFrontEnd/app/screens/PostLoginScreens/Forum/LocalSharedStyles.js b/ASACFrontEnd/app/screens/PostLoginScreens/Forum/LocalSharedStyles.js[m
[1mindex b262303..fcf4b18 100644[m
[1m--- a/ASACFrontEnd/app/screens/PostLoginScreens/Forum/LocalSharedStyles.js[m
[1m+++ b/ASACFrontEnd/app/screens/PostLoginScreens/Forum/LocalSharedStyles.js[m
[36m@@ -114,6 +114,12 @@[m [mconst getLocalStyles = (theme = 'light') => {[m
             marginBottom: 90, [m
             paddingTop: 25,[m
         },[m
[32m+[m[32m        header: {[m
[32m+[m[32m            fontSize: 28,[m
[32m+[m[32m            fontWeight: 'bold',[m
[32m+[m[32m            color: themeStyles[theme].textColor,[m[41m [m
[32m+[m[32m            marginBottom: 30,[m
[32m+[m[32m        },[m
     });[m
 };[m
 [m
[1mdiff --git a/ASACFrontEnd/app/screens/PostLoginScreens/Home/HomeScreen.js b/ASACFrontEnd/app/screens/PostLoginScreens/Home/HomeScreen.js[m
[1mindex b4ae3f2..2b9d6fd 100644[m
[1m--- a/ASACFrontEnd/app/screens/PostLoginScreens/Home/HomeScreen.js[m
[1m+++ b/ASACFrontEnd/app/screens/PostLoginScreens/Home/HomeScreen.js[m
[36m@@ -124,7 +124,7 @@[m [mconst HomeScreen = ({ navigation }) => {[m
                             </View>[m
                         </Modal>[m
 [m
[31m-                        <Text style={sharedStyles.cardHeader}>Upload an Employment Contract</Text>[m
[32m+[m[32m                        <Text style={sharedStyles.cardHeader}>Generate a Smart Contract</Text>[m
                         {/* DropZone */}[m
                         <TouchableOpacity style={localStyles.dropZone} onPress={() => handleFileSelectDropZone()}>[m
                             {selectedFile ? ([m
[36m@@ -133,7 +133,7 @@[m [mconst HomeScreen = ({ navigation }) => {[m
                                     <Text style={localStyles.buttonText}>{selectedFile.assets[0].name}</Text>[m
                                 </>[m
                             ) : ([m
[31m-                                <Text style={[localStyles.inputFieldText]}>Tap to select a .docx / .pdf / .txt file</Text>[m
[32m+[m[32m                                <Text style={[localStyles.inputFieldText]}>Tap to upload an employment contract</Text>[m
                             )}[m
                         </TouchableOpacity>[m
 [m
[1mdiff --git a/ASACFrontEnd/app/styles/SharedStyles.js b/ASACFrontEnd/app/styles/SharedStyles.js[m
[1mindex 7021957..65b8b21 100644[m
[1m--- a/ASACFrontEnd/app/styles/SharedStyles.js[m
[1m+++ b/ASACFrontEnd/app/styles/SharedStyles.js[m
[36m@@ -29,15 +29,6 @@[m [mconst getStyles = (theme = 'light') => {[m
             paddingTop: '5%',[m
             padding: '5%',[m
             backgroundColor: themeStyles[theme].containerBackground,[m
[31m-            [m
[31m-        },[m
[31m-        containerCommentScreen: {[m
[31m-            flex: 1,[m
[31m-            justifyContent: 'center',[m
[31m-            alignItems: 'center',[m
[31m-            paddingTop: '0%',[m
[31m-            padding: '5%',[m
[31m-            backgroundColor: themeStyles[theme].containerBackground, [m
         },[m
         containerWithoutBackground: {[m
             flex: 1,[m
[36m@@ -381,24 +372,10 @@[m [mconst getStyles = (theme = 'light') => {[m
         activityIndicator: {[m
             paddingTop: '10%',[m
         },[m
[31m-        generalText: {[m
[31m-            color: theme === 'dark' ? 'white' : 'black', [m
[31m-        },[m
         contractItemText: {[m
             color: theme === 'dark' ? 'white' : 'black', [m
             marginLeft: 5,[m
         },[m
[31m-        postsContainer: {[m
[31m-            flexDirection: 'row',[m
[31m-            marginTop: 10,[m
[31m-            alignItems: 'center', [m
[31m-            justifyContent: 'space-between', [m
[31m-        },[m
[31m-        postsButtonText: {[m
[31m-            flexDirection: 'row', [m
[31m-            alignItems: 'center', [m
[31m-            marginRight: 0,[m
[31m-        },[m
         postsViewContainer: {[m
             flexDirection: 'row', [m
             marginBottom: '10%',[m
[36m@@ -427,10 +404,7 @@[m [mconst getStyles = (theme = 'light') => {[m
             marginBottom: 90, [m
             paddingTop: 25,[m
         },[m
[31m-        flatListCommentsContainer: {[m
[31m-            width: '100%',[m
[31m-            marginBottom: 90,[m
[31m-        },[m
[32m+[m
         inputCommentsScreen: {[m
             height: 44,[m
             width: '96%', [m
