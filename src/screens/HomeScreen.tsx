import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../utils/colors';
import { User } from '../utils/interfaces';
import { sleep } from '../utils/helpers';

const ITEMS_PER_PAGE = 5;

const HomeScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    if (isLoading || !hasMorePages) return;

    setIsLoading(true);

    //Sleep is added here just to show loading indicator for a longer time so you can see it's infinite scrolling since API is fast and has only 12 entries
    await sleep(500);

    try {
      const response = await axios.get(`https://reqres.in/api/users`, {
        params: {
          page,
          per_page: ITEMS_PER_PAGE
        }
      });

      const newUsers = response.data.data;
      const totalUsers = response.data.total;
      const currentTotalUsers = users.length + newUsers.length;

      if (currentTotalUsers >= totalUsers) {
        setHasMorePages(false);
      }

      setUsers(prevUsers => [...prevUsers, ...newUsers]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMorePages) {
      setCurrentPage(currentPage => currentPage + 1);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.userContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text
          style={
            styles.userName
          }>{`${item.first_name} ${item.last_name}`}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={colors.primaryText} />
      </View>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <Text style={styles.header}>Users</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item: User, index) =>
          item.id?.toString() || index.toString()
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.75}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    paddingHorizontal: 16
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryText,
    marginBottom: 16
  },
  userContainer: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    padding: 24,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 25,
    marginRight: 16
  },
  userInfo: {
    flex: 1,
    gap: 4
  },
  userName: {
    fontSize: 24,
    color: colors.primaryText,
    fontWeight: 'bold'
  },
  userEmail: {
    fontSize: 16,
    color: colors.textOnDark
  },
  footer: {
    paddingVertical: 12,
    alignItems: 'center'
  }
});

export default HomeScreen;
