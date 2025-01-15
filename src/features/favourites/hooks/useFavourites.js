import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadFavourites, saveFavourites } from '../../utils/storage';
import { LOAD_FAVOURITES } from '../../../redux/types/favouriteTypes';

export const useFavourites = () => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favouriteReducer.favouriteItems);

  useEffect(() => {
    const initFavourites = async () => {
      const saved = await loadFavourites();
      dispatch({ type: LOAD_FAVOURITES, payload: saved });
    };
    initFavourites();
  }, []);

  useEffect(() => {
    saveFavourites(favourites);
  }, [favourites]);

  return { favourites };
};