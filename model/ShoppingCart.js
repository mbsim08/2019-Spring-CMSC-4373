class ShoppingCart{
    constructor(){
        //[{sbook, qty}]
        //sbook = {_id, title, price}
        this.items=[];
    }
    add(sbook){
        let found = false;
        for(const item of this.items){
            if(item.sbook._id == sbook._id){
                found = true;
                ++item.qty;
            }
        }
        if(!found){
            this.items.push({sbook: sbook, qty: 1});
        }
    }
    
    serialize(){
        return this.items;
    }

    static deserialize(items){
        const sc = new ShoppingCart();
        sc.items = items;
        return sc;
    }

    getQty(id){
        for (const item of this.items){
            if(item.sbook._id == id){
                return item.qty;
            }
        }
        return 0;
    }

    getTotal(){
        let sum = 0;
        for(const item of this.items){
            sum += item.qty *item.sbook.price;
        }
        return sum;
    }  
}
module.exports = ShoppingCart;