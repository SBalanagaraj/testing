// src/screens/UserList.js
import React, {useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator, Dimensions} from 'react-native';
import UserItem from '../Components/UserItem';
import {getFavorites, saveFavorites} from '../Utiles/Storage';
import Buttons from '../Components/Button';

import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {useRoute} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');

const UserList = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [load, setLoad] = useState(false);
  const API_KEY = 'reqres-free-v1';
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => r1.id !== r2.id),
  );
  const layoutProvider = new LayoutProvider(
    () => 'USER_ROW',
    (type, dim) => {
      dim.width = width;
      dim.height = 80;
    },
  );

  const route = useRoute();

  console.log(route, 'route');

  useEffect(() => {
    fetchUsers(1);
    loadFavorites();
  }, []);

  const fetchUsers = async () => {
    if (load || (totalPage !== 0 && pageCount > totalPage)) return;
    try {
      setLoad(true);
      const res = await fetch(`https://reqres.in/api/users?page=${pageCount}`, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY,
          Accept: 'application/json',
        },
      });
      if (res.status === 200) {
        const resJson = await res.json();
        if (resJson.data) {
          setDataProvider(prevProvider => {
            const existingData = prevProvider.getAllData();
            const collectAllData = [...existingData, ...resJson.data];
            return prevProvider.cloneWithRows(collectAllData);
          });
          setPageCount(prev => prev + 1);
          setTotalPage(resJson.total_pages);
        }
      }
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setLoad(false);
    }
  };

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavoriteIds(favs);
  };

  // console.log(dataProvider, 'dataProvider');

  const toggleFavorite = async user => {
    const updated = favoriteIds.includes(user)
      ? favoriteIds.filter(item => item.id !== user.id)
      : [...favoriteIds, user];
    setFavoriteIds(updated);
    await saveFavorites(updated);
  };

  const rowRenderer = (type, item) => {
    return (
      <UserItem
        user={item}
        isFavorite={favoriteIds.some(data => data.id == item.id)}
        onToggleFavorite={toggleFavorite}
      />
    );
  };

  return (
    <View style={{flex: 1, paddingVertical: 40}}>
      {load ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        dataProvider &&
        dataProvider.getSize() > 0 && (
          <>
            <Buttons
              altStyle={{margin: 20}}
              title={'View Favourites list'}
              onPress={() => navigation.navigate('favorites')}
            />
            {/* <FlatList
            data={users}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <UserItem
                user={item}
                isFavorite={favoriteIds.some(data => data.id == item.id)}
                onToggleFavorite={toggleFavorite}
              />
            )}
            onEndReached={fetchUsers}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              load ? <ActivityIndicator size="large" /> : null
            }
          /> */}
            <RecyclerListView
              dataProvider={dataProvider}
              layoutProvider={layoutProvider}
              rowRenderer={rowRenderer}
              onEndReached={fetchUsers}
              renderFooter={(type, item) =>
                load ? <ActivityIndicator size="large" /> : null
              }
            />
          </>
        )
      )}
    </View>
  );
};

export default UserList;
