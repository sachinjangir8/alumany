import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { messagesService, userProfileService, handleSupabaseError } from '../../utils/supabaseService';

const Messages = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    if (user) {
      loadMessages();
      loadConversations();
      
      // Check for pre-selected recipients from URL
      const recipientParam = searchParams.get('recipient');
      const recipientsParam = searchParams.get('recipients');
      
      if (recipientParam) {
        loadRecipient(recipientParam);
      } else if (recipientsParam) {
        loadRecipients(recipientsParam.split(','));
      }
    }
  }, [user, searchParams]);

  const loadMessages = async () => {
    try {
      const { data, error: fetchError } = await messagesService.getInboxMessages();
      if (fetchError) {
        setError(handleSupabaseError(fetchError, 'Failed to load messages'));
        return;
      }
      setMessages(data || []);
    } catch (error) {
      setError('Network error loading messages');
    }
  };

  const loadConversations = async () => {
    try {
      // Group messages by sender/recipient to create conversations
      const { data: allMessages, error: fetchError } = await messagesService.getInboxMessages();
      if (fetchError) {
        setError(handleSupabaseError(fetchError, 'Failed to load conversations'));
        return;
      }

      // Process messages into conversations
      const conversationMap = new Map();
      allMessages?.forEach(message => {
        const otherUserId = message.sender_id === user?.id ? message.recipient_id : message.sender_id;
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            userId: otherUserId,
            user: message.sender,
            lastMessage: message,
            unreadCount: message.is_read ? 0 : 1,
            messages: [message]
          });
        } else {
          const conversation = conversationMap.get(otherUserId);
          conversation.messages.push(message);
          if (!message.is_read && message.recipient_id === user?.id) {
            conversation.unreadCount++;
          }
          if (new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
            conversation.lastMessage = message;
          }
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      setError('Network error loading conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadRecipient = async (recipientId) => {
    try {
      const { data, error: fetchError } = await userProfileService.readById(recipientId);
      if (!fetchError && data) {
        setRecipients([data]);
      }
    } catch (error) {
      console.error('Error loading recipient:', error);
    }
  };

  const loadRecipients = async (recipientIds) => {
    try {
      const promises = recipientIds.map(id => userProfileService.readById(id));
      const results = await Promise.all(promises);
      const validRecipients = results
        .filter(result => !result.error && result.data)
        .map(result => result.data);
      setRecipients(validRecipients);
    } catch (error) {
      console.error('Error loading recipients:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || recipients.length === 0) return;

    try {
      setSendingMessage(true);
      setError('');

      // Send message to all recipients
      const promises = recipients.map(recipient =>
        messagesService.sendMessage(
          recipient.id,
          'Message from AlumniConnect',
          newMessage.trim()
        )
      );

      await Promise.all(promises);
      
      setNewMessage('');
      setRecipients([]);
      await loadMessages();
      await loadConversations();
      
      alert('Message sent successfully!');
    } catch (error) {
      setError('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await messagesService.markAsRead(messageId);
      await loadMessages();
      await loadConversations();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-muted-foreground">Loading messages...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Messages - AlumniConnect</title>
        <meta name="description" content="Connect and communicate with fellow alumni through our messaging system." />
      </Helmet>

      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
            <p className="text-muted-foreground">
              Stay connected with your alumni network
            </p>
          </div>
          
          <Button
            variant="default"
            onClick={() => setRecipients([])}
            iconName="Plus"
            iconPosition="left"
          >
            New Message
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 text-sm font-medium">Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Conversations</h2>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Icon name="MessageCircle" size={32} className="mx-auto mb-2" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.userId}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full p-4 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 ${
                        selectedConversation?.userId === conversation.userId ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {conversation.user?.full_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {conversation.user?.full_name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage?.content}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessage?.created_at)}
                        </div>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="w-2 h-2 bg-accent rounded-full ml-auto mt-1"></div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {selectedConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">
                      {selectedConversation.user?.full_name || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.user?.current_position} at {selectedConversation.user?.company}
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="h-96 overflow-y-auto p-4 space-y-4">
                    {selectedConversation.messages?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        onClick={() => !message.is_read && markAsRead(message.id)}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (selectedConversation) {
                              setRecipients([selectedConversation.user]);
                              sendMessage();
                            }
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => {
                          if (selectedConversation) {
                            setRecipients([selectedConversation.user]);
                            sendMessage();
                          }
                        }}
                        disabled={!newMessage.trim() || sendingMessage}
                        iconName="Send"
                        iconPosition="left"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                /* Compose New Message */
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">New Message</h3>
                  
                  {recipients.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Recipients:</p>
                      <div className="flex flex-wrap gap-2">
                        {recipients.map((recipient) => (
                          <span
                            key={recipient.id}
                            className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                          >
                            <span>{recipient.full_name}</span>
                            <button
                              onClick={() => setRecipients(prev => prev.filter(r => r.id !== recipient.id))}
                              className="hover:text-primary/70"
                            >
                              <Icon name="X" size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full h-32 p-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate('/alumni-directory')}
                      >
                        Find Recipients
                      </Button>
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || recipients.length === 0 || sendingMessage}
                        loading={sendingMessage}
                        iconName="Send"
                        iconPosition="left"
                      >
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;