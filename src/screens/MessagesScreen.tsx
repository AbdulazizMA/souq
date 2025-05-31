import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { isRTL } from '../utils/i18n';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'offer' | 'image';
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'rejected';
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  isVerified: boolean;
  lastMessage: Message;
  unreadCount: number;
  listingId?: string;
  listingTitle?: string;
  listingImage?: string;
  listingPrice?: number;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: 'user1',
    participantName: 'Ahmed Al-Rashid',
    isVerified: true,
    lastMessage: {
      id: 'msg1',
      senderId: 'user1',
      senderName: 'Ahmed Al-Rashid',
      content: 'Is the iPhone still available?',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      isRead: false,
      type: 'text',
    },
    unreadCount: 2,
    listingId: 'listing1',
    listingTitle: 'iPhone 14 Pro Max 256GB',
    listingImage: 'https://via.placeholder.com/60x60',
    listingPrice: 4500,
  },
  {
    id: '2',
    participantId: 'user2',
    participantName: 'Sara Mohammed',
    isVerified: true,
    lastMessage: {
      id: 'msg2',
      senderId: 'currentUser',
      senderName: 'You',
      content: 'Thank you for your interest!',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: true,
      type: 'text',
    },
    unreadCount: 0,
    listingId: 'listing2',
    listingTitle: 'Toyota Camry 2020',
    listingImage: 'https://via.placeholder.com/60x60',
    listingPrice: 85000,
  },
  {
    id: '3',
    participantId: 'user3',
    participantName: 'Omar Hassan',
    isVerified: false,
    lastMessage: {
      id: 'msg3',
      senderId: 'user3',
      senderName: 'Omar Hassan',
      content: 'I offer 3500 SAR for the MacBook',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isRead: false,
      type: 'offer',
      offerAmount: 3500,
      offerStatus: 'pending',
    },
    unreadCount: 1,
    listingId: 'listing3',
    listingTitle: 'MacBook Pro 16" M2',
    listingImage: 'https://via.placeholder.com/60x60',
    listingPrice: 12000,
  },
];

const mockMessages: { [conversationId: string]: Message[] } = {
  '1': [
    {
      id: 'msg1-1',
      senderId: 'user1',
      senderName: 'Ahmed Al-Rashid',
      content: 'Hello! I\'m interested in your iPhone listing.',
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg1-2',
      senderId: 'currentUser',
      senderName: 'You',
      content: 'Hi Ahmed! Yes, it\'s still available. Would you like to see it?',
      timestamp: new Date(Date.now() - 3300000),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg1-3',
      senderId: 'user1',
      senderName: 'Ahmed Al-Rashid',
      content: 'Is the iPhone still available?',
      timestamp: new Date(Date.now() - 300000),
      isRead: false,
      type: 'text',
    },
  ],
};

const MessagesScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { t } = useTranslation('common');
  const rtl = isRTL();

  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadMessages = (conversationId: string) => {
    const conversationMessages = mockMessages[conversationId] || [];
    setMessages(conversationMessages);
    
    // Mark messages as read
    setTimeout(() => {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    }, 1000);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return rtl ? 'الآن' : 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}${rtl ? 'د' : 'm'}`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}${rtl ? 'س' : 'h'}`;
    
    const diffInDays = Math.floor(diffInMinutes / 1440);
    if (diffInDays === 1) return rtl ? 'أمس' : 'yesterday';
    if (diffInDays < 7) return `${diffInDays}${rtl ? 'ي' : 'd'}`;
    
    return date.toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'currentUser',
      senderName: 'You',
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: true,
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation's last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: message }
          : conv
      )
    );

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleOfferResponse = (messageId: string, status: 'accepted' | 'rejected') => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, offerStatus: status }
          : msg
      )
    );

    Alert.alert(
      status === 'accepted' ? (rtl ? 'تم قبول العرض' : 'Offer Accepted') : (rtl ? 'تم رفض العرض' : 'Offer Rejected'),
      status === 'accepted' 
        ? rtl ? 'تم قبول العرض بنجاح' : 'The offer has been accepted successfully'
        : rtl ? 'تم رفض العرض' : 'The offer has been rejected'
    );
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        selectedConversation?.id === item.id && styles.selectedConversation
      ]}
      onPress={() => setSelectedConversation(item)}
    >
      <View style={styles.conversationLeft}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.participantName.charAt(0)}
            </Text>
          </View>
          {item.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color={COLORS.white} />
            </View>
          )}
        </View>
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.participantName} numberOfLines={1}>
              {item.participantName}
            </Text>
            <Text style={styles.timestamp}>
              {formatTime(item.lastMessage.timestamp)}
            </Text>
          </View>
          
          {item.listingTitle && (
            <Text style={styles.listingTitle} numberOfLines={1}>
              {item.listingTitle}
            </Text>
          )}
          
          <View style={styles.lastMessageContainer}>
            <Text
              style={[
                styles.lastMessage,
                item.unreadCount > 0 && styles.unreadMessage
              ]}
              numberOfLines={1}
            >
              {item.lastMessage.type === 'offer' 
                ? `${rtl ? 'عرض:' : 'Offer:'} ${item.lastMessage.offerAmount} ${t('common.currency')}`
                : item.lastMessage.content
              }
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {item.unreadCount > 9 ? '9+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      {item.listingImage && (
        <Image source={{ uri: item.listingImage }} style={styles.listingImage} />
      )}
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === 'currentUser';
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        {item.type === 'offer' ? (
          <View style={[
            styles.offerMessage,
            isCurrentUser ? styles.currentUserOffer : styles.otherUserOffer
          ]}>
            <Text style={styles.offerLabel}>
              {rtl ? 'عرض سعر' : 'Price Offer'}
            </Text>
            <Text style={styles.offerAmount}>
              {item.offerAmount} {t('common.currency')}
            </Text>
            
            {!isCurrentUser && item.offerStatus === 'pending' && (
              <View style={styles.offerActions}>
                <TouchableOpacity
                  style={[styles.offerButton, styles.acceptButton]}
                  onPress={() => handleOfferResponse(item.id, 'accepted')}
                >
                  <Text style={styles.acceptButtonText}>
                    {rtl ? 'قبول' : 'Accept'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.offerButton, styles.rejectButton]}
                  onPress={() => handleOfferResponse(item.id, 'rejected')}
                >
                  <Text style={styles.rejectButtonText}>
                    {rtl ? 'رفض' : 'Reject'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {item.offerStatus && item.offerStatus !== 'pending' && (
              <Text style={[
                styles.offerStatus,
                item.offerStatus === 'accepted' ? styles.acceptedStatus : styles.rejectedStatus
              ]}>
                {item.offerStatus === 'accepted' 
                  ? rtl ? 'تم القبول' : 'Accepted'
                  : rtl ? 'تم الرفض' : 'Rejected'
                }
              </Text>
            )}
          </View>
        ) : (
          <View style={[
            styles.textMessage,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            <Text style={[
              styles.messageText,
              isCurrentUser ? styles.currentUserMessageText : styles.otherUserMessageText
            ]}>
              {item.content}
            </Text>
          </View>
        )}
        
        <Text style={[
          styles.messageTime,
          isCurrentUser ? styles.currentUserTime : styles.otherUserTime
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  const ConversationsList = () => (
    <View style={styles.conversationsContainer}>
      <View style={styles.conversationsHeader}>
        <Text style={styles.conversationsTitle}>
          {rtl ? 'المحادثات' : 'Conversations'}
        </Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Ionicons name="create-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color={COLORS.gray400} />
          <Text style={styles.emptyStateText}>
            {rtl ? 'لا توجد محادثات' : 'No Conversations'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {rtl ? 'ابدأ محادثة عن طريق التواصل مع بائع' : 'Start a conversation by contacting a seller'}
          </Text>
        </View>
      )}
    </View>
  );

  const ChatView = () => (
    <View style={styles.chatContainer}>
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedConversation(null)}
        >
          <Ionicons
            name={rtl ? 'chevron-forward' : 'chevron-back'}
            size={24}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
        
        <View style={styles.chatHeaderInfo}>
          <View style={styles.chatAvatar}>
            <Text style={styles.chatAvatarText}>
              {selectedConversation?.participantName.charAt(0)}
            </Text>
          </View>
          <View style={styles.chatHeaderText}>
            <Text style={styles.chatParticipantName}>
              {selectedConversation?.participantName}
              {selectedConversation?.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
              )}
            </Text>
            {selectedConversation?.listingTitle && (
              <Text style={styles.chatListingTitle} numberOfLines={1}>
                {selectedConversation.listingTitle}
              </Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity style={styles.chatMenuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.messageInputContainer}
      >
        <View style={styles.messageInputWrapper}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={20} color={COLORS.gray400} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.messageInput}
            placeholder={rtl ? 'اكتب رسالة...' : 'Type a message...'}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              newMessage.trim() && styles.sendButtonActive
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={newMessage.trim() ? COLORS.white : COLORS.gray400}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {selectedConversation ? <ChatView /> : <ConversationsList />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Conversations List Styles
  conversationsContainer: {
    flex: 1,
  },
  conversationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  conversationsTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedConversation: {
    backgroundColor: COLORS.primaryLight + '10',
  },
  conversationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  participantName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  timestamp: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  listingTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  lastMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  unreadBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  listingImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: SPACING.md,
  },
  // Chat View Styles
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.small,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  chatAvatarText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatParticipantName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  chatListingTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  chatMenuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },
  messagesContent: {
    paddingVertical: SPACING.md,
  },
  messageContainer: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.xs,
  },
  currentUserMessage: {
    alignItems: 'flex-end',
  },
  otherUserMessage: {
    alignItems: 'flex-start',
  },
  textMessage: {
    maxWidth: '80%',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  currentUserText: {
    backgroundColor: COLORS.primary,
  },
  otherUserText: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    lineHeight: 20,
  },
  currentUserMessageText: {
    color: COLORS.white,
  },
  otherUserMessageText: {
    color: COLORS.textPrimary,
  },
  offerMessage: {
    maxWidth: '80%',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
  },
  currentUserOffer: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary + '10',
  },
  otherUserOffer: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
  },
  offerLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  offerAmount: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.secondary,
    marginBottom: SPACING.md,
  },
  offerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  offerButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: COLORS.success,
  },
  rejectButton: {
    backgroundColor: COLORS.error,
  },
  acceptButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
  },
  rejectButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
  },
  offerStatus: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  acceptedStatus: {
    color: COLORS.success,
  },
  rejectedStatus: {
    color: COLORS.error,
  },
  messageTime: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  currentUserTime: {
    textAlign: 'right',
  },
  otherUserTime: {
    textAlign: 'left',
  },
  messageInputContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  messageInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.md,
    maxHeight: 100,
    backgroundColor: COLORS.white,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default MessagesScreen; 