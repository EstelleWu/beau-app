import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ImageBackground,
} from 'react-native';

const { width } = Dimensions.get('window');

// Message interface
interface Message {
  id: number;
  content: string;
  isUser: boolean;
  date: Date;
}

// Background options inspired by Telegram
const BACKGROUND_OPTIONS = [
  {
    id: 'telegram_blue',
    name: 'Telegram Blue',
    gradient: ['#0088cc', '#005580'],
  },
  {
    id: 'sunset_warm',
    name: 'Warm Sunset',
    gradient: ['#ff6b6b', '#feca57'],
  },
  {
    id: 'ocean_deep',
    name: 'Deep Ocean',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 'forest_green',
    name: 'Forest Green',
    gradient: ['#56ab2f', '#a8e6cf'],
  },
  {
    id: 'purple_dream',
    name: 'Purple Dream',
    gradient: ['#c471ed', '#f7797d'],
  },
  {
    id: 'midnight_blue',
    name: 'Midnight Blue',
    gradient: ['#2c3e50', '#34495e'],
  },
];

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUND_OPTIONS[0]);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Start pulse animation for avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now(),
      content: "Hi! I'm Beau, your relationship coach. I'm here to help you navigate your relationships with wisdom and empathy. What's on your mind today? 💚",
      isUser: false,
      date: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnim.setValue(0);
    }
  }, [isTyping]);

  const handleSendMessage = () => {
    try {
      console.log('🔍 Sending message:', inputText);
      
      // Validate content
      if (!inputText || inputText.trim() === '') {
        console.log('🔍 Empty message, ignoring');
        return;
      }
      
      const messageContent = inputText.trim();
      
      const userMessage: Message = {
        id: Date.now(),
        content: messageContent,
        isUser: true,
        date: new Date(),
      };
      
      console.log('🔍 User message created:', userMessage);
      setMessages(prev => [...prev, userMessage]);
      setInputText(''); // Clear input
      
      // Auto-scroll to bottom after a short delay
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Simulate AI response (for testing purposes)
      setTimeout(() => {
        setIsTyping(false); // Hide typing indicator
        try {
          const aiMessage: Message = {
            id: Date.now() + 1,
            content: "Thanks for your message! I'm here to help with your relationship questions. What's on your mind?",
            isUser: false,
            date: new Date(),
          };
          console.log('🔍 AI response created:', aiMessage);
          setMessages(prev => [...prev, aiMessage]);
          
          // Auto-scroll to bottom after AI response
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        } catch (error) {
          console.error('🚨 Error creating AI response:', error);
          if (error instanceof Error) {
            console.error('🚨 Error details:', error.message, error.stack);
          }
        }
      }, 1000); // 1 second delay to simulate AI processing
    } catch (error) {
      console.error('🚨 Error in handleSendMessage:', error);
      if (error instanceof Error) {
        console.error('🚨 Error details:', error.message, error.stack);
      }
    }
  };

  const renderBackgroundPicker = () => {
    if (!showBackgroundPicker) return null;

    return (
      <Animated.View style={[styles.backgroundPicker, { opacity: fadeAnim }]}>
        <View style={styles.backgroundPickerContent}>
          <Text style={styles.backgroundPickerTitle}>Choose Background</Text>
          <View style={styles.backgroundOptions}>
            {BACKGROUND_OPTIONS.map((bg) => (
              <TouchableOpacity
                key={bg.id}
                style={[
                  styles.backgroundOption,
                  selectedBackground.id === bg.id && styles.backgroundOptionSelected
                ]}
                onPress={() => {
                  setSelectedBackground(bg);
                  setShowBackgroundPicker(false);
                }}
              >
                <View style={[
                  styles.backgroundPreview,
                  { backgroundColor: bg.gradient[0] }
                ]} />
                <Text style={styles.backgroundOptionText}>{bg.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowBackgroundPicker(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} testID="chat-container">
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Forest Background Image */}
        <ImageBackground
          source={require('../assets/images/forest-background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.backgroundOverlay} />
        </ImageBackground>



        {/* Beautiful Header */}
        <View style={styles.header}>
          <View style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.avatarEmoji}>💙</Text>
              </Animated.View>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Beau</Text>
                <Text style={styles.headerSubtitle}>Your Relationship Coach</Text>
              </View>
              <View style={styles.statusIndicator}>
                <Animated.View style={[styles.statusDot, { transform: [{ scale: pulseAnim }] }]} />
                <Text style={styles.statusText}>Online</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chat View */}
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}
            contentContainerStyle={styles.messagesContainer}
            testID="message-list"
            ListFooterComponent={() => 
              isTyping ? (
                <View style={styles.aiMessageContainer}>
                  <View style={styles.aiAvatar}>
                    <Text style={styles.aiAvatarText}>💜</Text>
                  </View>
                  <View style={styles.typingBubble}>
                    <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                    <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                    <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                  </View>
                </View>
              ) : null
            }
            renderItem={({ item }) => (
              <View style={[
                styles.messageContainer,
                item.isUser ? styles.userMessageContainer : styles.aiMessageContainer
              ]}>
                {!item.isUser && (
                  <View style={styles.aiAvatar}>
                    <Text style={styles.aiAvatarText}>💜</Text>
                  </View>
                )}
                <View style={[
                  styles.messageBubble,
                  item.isUser ? styles.userMessage : styles.aiMessage
                ]}>
                  <Text style={[
                    styles.messageText,
                    item.isUser ? styles.userMessageText : styles.aiMessageText
                  ]}>
                    {item.content}
                  </Text>
                  <Text style={styles.messageTime}>
                    {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            )}
            style={styles.messagesList}
          />
          
          {/* Input Area */}
          <View style={styles.bottomContainerStyle}>
            <View style={styles.inputRow}>
                          <TextInput
              style={[styles.inputStyle, { minHeight: 40, maxHeight: 100 }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              maxLength={500}
              multiline={true}
              textAlignVertical="center"
            />
              <TouchableOpacity
                style={styles.sendButtonContainerStyle}
                onPress={handleSendMessage}
                testID="send-button"
              />
            </View>
          </View>
        </View>


      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a4d2e',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  backgroundPickerButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  backgroundPickerButtonText: {
    fontSize: 18,
  },
  backgroundPicker: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  backgroundPickerContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  backgroundPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1F2937',
  },
  backgroundOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backgroundOption: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  backgroundOptionSelected: {
    borderColor: '#0088cc',
    backgroundColor: 'rgba(0, 136, 204, 0.1)',
  },
  backgroundPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 5,
  },
  backgroundOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
  },
  closeButton: {
    backgroundColor: '#0088cc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerGradient: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
  },
  chatContainerStyle: {
    flex: 1,
    paddingHorizontal: 16,
    borderTopWidth: 0,
    borderTopColor: 'transparent',
  },
  bottomContainerStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0,
    borderTopColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputStyle: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButtonContainerStyle: {
    backgroundColor: 'rgba(102, 126, 234, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    shadowColor: 'rgba(102, 126, 234, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  userBubbleTextStyle: {
    color: '#1F2937',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
  },
  aiBubbleTextStyle: {
    color: '#1F2937',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
  },
  dateTextStyle: {
    fontSize: 11,
    color: 'rgba(31, 41, 55, 0.6)',
    fontWeight: '500',
  },
  sendButtonIcon: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  aiAvatarText: {
    fontSize: 16,
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#1F2937',
    fontWeight: '500',
  },
  aiMessageText: {
    color: '#1F2937',
    fontWeight: '400',
  },
  messageTime: {
    fontSize: 11,
    color: 'rgba(31, 41, 55, 0.6)',
    marginTop: 4,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  typingBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  avatarText: {
    fontSize: 14,
  },
});

export default ChatScreen; 