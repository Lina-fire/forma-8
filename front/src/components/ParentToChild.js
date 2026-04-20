import React from 'react';
import ChildReceiver from './ChildReceiver';

function ParentToChild({ product }) {
  return (
    <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
      <h4>Родительский компонент передает данные:</h4>
      <ChildReceiver 
        name={product.name}
        size={product.size}
        material={product.material}
        color={product.color}
        price={product.price}
      />
    </div>
  );
}

export default ParentToChild;