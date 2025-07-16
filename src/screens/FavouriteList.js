// src/screens/Favorites.js
import React, {useEffect, useState} from 'react';
import {Text, Dimensions} from 'react-native';
import UserItem from '../Components/UserItem';
import {getFavorites, saveFavorites} from '../Utiles/Storage';
import Buttons from '../Components/Button';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {useRoute} from '@react-navigation/native';

const Favorites = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => r1.id !== r2.id),
  );
  const {width, height} = Dimensions.get('screen');
  const route = useRoute();
  console.log(route, 'route');

  useEffect(() => {
    (async () => {
      const favList = await getFavorites();
      setDataProvider(dataProvider.cloneWithRows(favList));
    })();
  }, []);

  const layoutProvider = new LayoutProvider(
    () => 'USER_ROW',
    (type, dim) => {
      dim.width = width;
      dim.height = 80;
    },
  );

  if (dataProvider.getSize() === 0) {
    return <Text style={{margin: 20}}>No favorites found.</Text>;
  }

  const rowRenderer = (type, item) => {
    return (
      <UserItem user={item} isFavorite={true} onToggleFavorite={() => {}} />
    );
  };

  return (
    <>
      <RecyclerListView
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
      />
      <Buttons
        altStyle={{margin: 20}}
        title={'Go Back orgin'}
        onPress={() => navigation.goBack()}
      />
    </>
  );
};

export default Favorites;
