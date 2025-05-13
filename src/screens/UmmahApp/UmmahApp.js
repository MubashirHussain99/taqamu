import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import { Image } from 'react-native-svg';

const Tab = createBottomTabNavigator();

const UmmahApp = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Forums') {
              iconName = 'forum';
            } else if (route.name === 'Groups') {
              iconName = 'groups';
            } else if (route.name === 'People') {
              iconName = 'people';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}>
        <Tab.Screen name="Forums" component={ForumsScreen} />
        <Tab.Screen name="Groups" component={GroupsScreen} />
        <Tab.Screen name="People" component={PeopleScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

// Chat Modal Component
const ChatModal = ({visible, onClose, user}) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    Alert.alert('Message Sent', `To: ${user?.name}\nMessage: ${message}`);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chat with {user?.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.messageInput}
            placeholder="Type your message..."
            multiline
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Create Group Modal Component
const CreateGroupModal = ({visible, onClose, onCreate}) => {
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState('study');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    const newGroup = {
      name: groupName,
      type: groupType,
      description,
    };

    onCreate(newGroup);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Group</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Group Name"
            value={groupName}
            onChangeText={setGroupName}
          />

          <View style={styles.typeSelector}>
            <Text style={styles.label}>Group Type:</Text>
            <View style={styles.typeOptions}>
              {['study', 'networking', 'support', 'art', 'charity'].map(
                type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      groupType === type && styles.selectedTypeOption,
                    ]}
                    onPress={() => setGroupType(type)}>
                    <Text
                      style={
                        groupType === type
                          ? styles.selectedTypeText
                          : styles.typeText
                      }>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </View>

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Group Description"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity
            style={styles.createGroupButton}
            onPress={handleCreate}>
            <Text style={styles.createGroupButtonText}>Create Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const PeopleScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Everyone');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [peopleData, setPeopleData] = useState({
    Everyone: [
      {
        id: '1',
        initials: 'AH',
        name: 'Ahmed Hassan',
        username: '@ahmedh',
        location: 'Cairo, Egypt',
        bio: 'Software engineer, love reading and hiking',
        mutualFriends: '5 mutual friends',
        status: 'following',
      },
      {
        id: '2',
        initials: 'FK',
        name: 'Fatima Khan',
        username: '@fatimak',
        location: 'Toronto, Canada',
        bio: 'Medical student, avid book reader',
        mutualFriends: '2 mutual friends',
        status: 'follow',
      },
      {
        id: '3',
        initials: 'OF',
        name: 'Omar Farooq',
        username: '@omarf',
        location: 'Dubai, UAE',
        bio: 'Finance professional, martial arts enthusiast',
        mutualFriends: '8 mutual friends',
        status: 'following',
      },
      {
        id: '4',
        initials: 'AM',
        name: 'Aisha Malik',
        username: '@aisham',
        location: 'London, UK',
        bio: 'Teacher and educational content creator',
        mutualFriends: '',
        status: 'follow',
      },
      {
        id: '5',
        initials: 'YA',
        name: 'Yusuf Ali',
        username: '@yusufa',
        location: 'Kuala Lumpur, Malaysia',
        bio: 'Islamic studies student, calligraphy hobbyist',
        mutualFriends: '3 mutual friends',
        status: 'follow',
      },
    ],
    Friends: [
      {
        id: '1',
        initials: 'AH',
        name: 'Ahmed Hassan',
        username: '@ahmedh',
        location: 'Cairo, Egypt',
        bio: 'Software engineer, love reading and hiking',
        mutualFriends: '5 mutual friends',
        status: 'following',
      },
      {
        id: '3',
        initials: 'OF',
        name: 'Omar Farooq',
        username: '@omarf',
        location: 'Dubai, UAE',
        bio: 'Finance professional, martial arts enthusiast',
        mutualFriends: '8 mutual friends',
        status: 'following',
      },
    ],
    Following: [
      {
        id: '1',
        initials: 'AH',
        name: 'Ahmed Hassan',
        username: '@ahmedh',
        location: 'Cairo, Egypt',
        bio: 'Software engineer, love reading and hiking',
        mutualFriends: '5 mutual friends',
        status: 'following',
      },
      {
        id: '3',
        initials: 'OF',
        name: 'Omar Farooq',
        username: '@omarf',
        location: 'Dubai, UAE',
        bio: 'Finance professional, martial arts enthusiast',
        mutualFriends: '8 mutual friends',
        status: 'following',
      },
      {
        id: '5',
        initials: 'YA',
        name: 'Yusuf Ali',
        username: '@yusufa',
        location: 'Kuala Lumpur, Malaysia',
        bio: 'Islamic studies student, calligraphy hobbyist',
        mutualFriends: '3 mutual friends',
        status: 'following',
      },
    ],
    Followers: [
      {
        id: '2',
        initials: 'FK',
        name: 'Fatima Khan',
        username: '@fatimak',
        location: 'Toronto, Canada',
        bio: 'Medical student, avid book reader',
        mutualFriends: '2 mutual friends',
        status: 'follow',
      },
      {
        id: '4',
        initials: 'AM',
        name: 'Aisha Malik',
        username: '@aisham',
        location: 'London, UK',
        bio: 'Teacher and educational content creator',
        mutualFriends: '',
        status: 'follow',
      },
    ],
  });

  const handleFollow = userId => {
    setPeopleData(prev => {
      const updated = {...prev};
      Object.keys(updated).forEach(key => {
        updated[key] = updated[key].map(user => {
          if (user.id === userId) {
            return {
              ...user,
              status: user.status === 'follow' ? 'following' : 'follow',
            };
          }
          return user;
        });
      });
      return updated;
    });
  };

  const openChat = user => {
    setSelectedUser(user);
    setChatModalVisible(true);
  };

  const peopleTabs = ['Everyone', 'Friends', 'Following', 'Followers'];

  return (
    <View style={styles.screenContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.createButtonText}>❌</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Ummah</Text>
        {/* Empty space to balance the layout */}
        <Text style={styles.screenTitle}> </Text>
      </View>

      <View style={styles.searchContainer}>
        <Image
          source={require('../../assets/images/SearchIcon.png')} // 🔁 adjust the path to your actual image file
          style={{width: 12, height: 24, marginRight: 8}}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search forums, groups or people..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        {peopleTabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={activeTab === tab ? styles.activeTab : styles.tab}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={activeTab === tab ? styles.activeTabText : styles.tabText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={peopleData[activeTab]}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.personItem}>
            <View style={styles.personHeader}>
              <View style={styles.personInitials}>
                <Text style={styles.initialsText}>{item.initials}</Text>
              </View>
              <View style={styles.personInfo}>
                <Text style={styles.personName}>{item.name}</Text>
                <Text style={styles.personUsername}>
                  {item.username} - {item.location}
                </Text>
                <Text style={styles.personBio}>{item.bio}</Text>
                {item.mutualFriends && (
                  <Text style={styles.mutualFriends}>{item.mutualFriends}</Text>
                )}
              </View>
            </View>
            <View style={styles.personActions}>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => openChat(item)}>
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  item.status === 'following'
                    ? styles.followingButton
                    : styles.followButton
                }
                onPress={() => handleFollow(item.id)}>
                <Text
                  style={
                    item.status === 'following'
                      ? styles.followingButtonText
                      : styles.followButtonText
                  }>
                  {item.status === 'following' ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <ChatModal
        visible={chatModalVisible}
        onClose={() => setChatModalVisible(false)}
        user={selectedUser}
      />
    </View>
  );
};

const GroupsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All Groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [createGroupModalVisible, setCreateGroupModalVisible] = useState(false);
  const [groupsData, setGroupsData] = useState([
    {
      id: '1',
      initials: 'QS',
      name: 'Quran Study Circle',
      type: 'study',
      description: 'Regular meetings to study and reflect on Quran',
      members: '125 members',
      status: 'joined',
    },
    {
      id: '2',
      initials: 'NM',
      name: 'NYC Muslim Professionals',
      type: 'networking',
      description: 'Networking group for Muslim professionals in New York',
      members: '348 members',
      status: 'join',
    },
    {
      id: '3',
      initials: 'SS',
      name: 'Sisters Support Group',
      type: 'support',
      description: 'Mutual support and mentorship for Muslim women',
      members: '213 members',
      status: 'join',
    },
    {
      id: '4',
      initials: 'IA',
      name: 'Islamic Art & Calligraphy',
      type: 'art',
      description: 'Appreciate and share Islamic art and calligraphy',
      members: '179 members',
      status: 'joined',
    },
    {
      id: '5',
      initials: 'CV',
      name: 'Charity Volunteers',
      type: 'charity',
      description: 'Organize and participate in charity events',
      members: '256 members',
      status: 'join',
    },
  ]);

  const handleJoinGroup = groupId => {
    setGroupsData(prev =>
      prev.map(group =>
        group.id === groupId
          ? {...group, status: group.status === 'join' ? 'joined' : 'join'}
          : group,
      ),
    );
  };

  const handleCreateGroup = newGroup => {
    const newId = (groupsData.length + 1).toString();
    setGroupsData(prev => [
      ...prev,
      {
        id: newId,
        initials: newGroup.name
          .split(' ')
          .map(w => w[0])
          .join('')
          .substring(0, 2)
          .toUpperCase(),
        name: newGroup.name,
        type: newGroup.type,
        description: newGroup.description,
        members: '1 member',
        status: 'joined',
      },
    ]);
    Alert.alert('Success', 'Group created successfully!');
  };

  const groupTypes = [
    'All Groups',
    'Study',
    'Networking',
    'Support',
    'Charity',
  ];

  return (
    <View style={styles.screenContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.createButtonText}>❌</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Ummah</Text>
        {/* Empty space to balance the layout */}
        <Text style={styles.screenTitle}> </Text>
      </View>

      <View style={styles.searchContainer}>
        <Image
          source={require('../../assets/images/SearchIcon.png')} // 🔁 adjust the path to your actual image file
          style={{width: 12, height: 24, marginRight: 8}}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search forums, groups or people..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        {groupTypes.map(type => (
          <TouchableOpacity
            key={type}
            style={activeTab === type ? styles.activeTab : styles.tab}
            onPress={() => setActiveTab(type)}>
            <Text
              style={
                activeTab === type ? styles.activeTabText : styles.tabText
              }>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={groupsData.filter(
          group =>
            activeTab === 'All Groups' ||
            group.type === activeTab.toLowerCase(),
        )}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.groupItem}>
            <View style={styles.groupHeader}>
              <View style={styles.groupInitials}>
                <Text style={styles.initialsText}>{item.initials}</Text>
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.groupType}>{item.type}</Text>
              </View>
            </View>
            <Text style={styles.groupDescription}>{item.description}</Text>
            <View style={styles.groupFooter}>
              <Text style={styles.membersText}>{item.members}</Text>
              <TouchableOpacity style={styles.chatButton}>
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  item.status === 'joined'
                    ? styles.joinedButton
                    : styles.joinButton
                }
                onPress={() => handleJoinGroup(item.id)}>
                <Text
                  style={
                    item.status === 'joined'
                      ? styles.joinedButtonText
                      : styles.joinButtonText
                  }>
                  {item.status === 'joined' ? 'Joined' : 'Join Group'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setCreateGroupModalVisible(true)}>
        <Text style={styles.createButtonText}>+ Create New Group</Text>
      </TouchableOpacity>

      <CreateGroupModal
        visible={createGroupModalVisible}
        onClose={() => setCreateGroupModalVisible(false)}
        onCreate={handleCreateGroup}
      />
    </View>
  );
};

const ForumsScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const forumsData = [
    {
      id: '1',
      title: 'Religious Discussions',
      description:
        'Discuss Islamic theology, fiqh, and contemporary religious questions',
      stats: '2.543',
      posts: '450 posts',
      time: '5 min ago',
    },
    {
      id: '2',
      title: 'Life Advice',
      description:
        'Seek guidance on personal, career, and family matters from an Islamic perspective',
      stats: '1.872',
      posts: '392 posts',
      time: '2 hrs ago',
    },
    {
      id: '3',
      title: 'Cultural Exchange',
      description:
        'Share and learn about diverse Muslim cultures, traditions, and experiences',
      stats: '1.291',
      posts: '203 posts',
      time: '30 min ago',
    },
    {
      id: '4',
      title: 'New Muslims',
      description: 'Support and resources for those new to Islam',
      stats: '892',
      posts: '175 posts',
      time: '1 hr ago',
    },
    {
      id: '5',
      title: 'Youth Corner',
      description:
        'A safe space for young Muslims to connect and discuss challenges',
      stats: '1.753',
      posts: '328 posts',
      time: '15 min ago',
    },
  ];

  return (
    <View style={styles.screenContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.createButtonText}>❌</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Ummah</Text>
        {/* Empty space to balance the layout */}
        <Text style={styles.screenTitle}> </Text>
      </View>

      <View style={styles.searchContainer}>
        <Image
          source={require('../../assets/images/SearchIcon.png')} // 🔁 adjust the path to your actual image file
          style={{width: 24, height: 24, marginRight: 8}}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search forums, groups or people..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={forumsData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.forumItem}>
            <Text style={styles.forumTitle}>{item.title}</Text>
            <Text style={styles.forumDescription}>{item.description}</Text>
            <View style={styles.forumStats}>
              <Text style={styles.statText}>{item.stats}</Text>
              <Text style={styles.statText}>{item.posts}</Text>
              <Text style={styles.statText}>{item.time}</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>+ Create New Forum</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  screenContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f172a',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    color: '#fff',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  forumItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 8,
  },
  forumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  forumDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  forumStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 12,
    color: '#fff',
  },
  groupItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupInitials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialsText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  groupType: {
    fontSize: 12,
    color: '#fff',
    textTransform: 'capitalize',
  },
  groupDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
  },
  groupFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membersText: {
    fontSize: 12,
    color: '#fff',
  },
  chatButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginRight: 8,
  },
  chatButtonText: {
    color: '#4CAF50',
    fontSize: 12,
  },
  joinButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  joinedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  joinedButtonText: {
    color: '#000',
    fontSize: 12,
  },
  personItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 8,
  },
  personHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  personInitials: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  personUsername: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  personBio: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  mutualFriends: {
    fontSize: 12,
    color: '#fff',
  },
  personActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageButton: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginRight: 8,
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  followButton: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  followingButton: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  followingButtonText: {
    color: '#000',
    fontSize: 14,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    elevation: 3,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    minHeight: 100,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Create Group Modal styles
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 8,
    color: '#000',
  },
  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeOption: {
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedTypeOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  typeText: {
    color: '#000',
  },
  selectedTypeText: {
    color: 'white',
  },
  createGroupButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  createGroupButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UmmahApp;
