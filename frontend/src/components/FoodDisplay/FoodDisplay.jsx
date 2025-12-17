import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import { useTranslation } from 'react-i18next';

const FoodDisplay = ({category}) => {

    const {food_list} = useContext(StoreContext)
    const { t } = useTranslation();
  return (
    <div className='food-display' id='food-display'>
        <h2 className='h2we'>{t('display_title')}</h2>
        <div className="food-display-list">
            {food_list
                .filter(item => category === "All" || category === item.category)
                .map(item => (
                    <FoodItem
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        image={item.image}
                        shopName={item.shopId?.shopName}
                    />
                ))}
        </div>
    </div>
  )
}

export default FoodDisplay