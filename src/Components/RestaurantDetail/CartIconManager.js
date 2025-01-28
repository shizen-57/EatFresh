import React from 'react';
import { useGroupOrder } from '../../features/group_ordering/context/GroupOrderContext';
import GroupCartIcon from '../../features/group_ordering/group_cart/GroupCartIcon';
import CartIcon from './CartIcon';

const CartIconManager = ({ navigation }) => {
  const { groupOrder, groupCart } = useGroupOrder();

  if (groupOrder) {
    return <GroupCartIcon 
      navigation={navigation} 
      itemCount={groupCart.length}
      onPress={() => navigation.navigate('GroupOrder')}
    />;
  }

  return <CartIcon navigation={navigation} />;
};

export default CartIconManager;
