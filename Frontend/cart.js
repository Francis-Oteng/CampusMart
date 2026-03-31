/* ─── cart.js — Cart with API Integration ─── */
var PROMOS = { 'STUDENT10':{type:'pct',value:10,label:'10% student discount'}, 'CAMPUS20':{type:'pct',value:20,label:'20% campus discount'}, 'FLAT50':{type:'fixed',value:50,label:'₵50 off'}, 'NEWUSER':{type:'pct',value:15,label:'15% first-order discount'} };
var SUGGESTIONS = [
  {id:101,name:'Resin Earrings',cat:'Fashion',price:120,color:'#fde68a',img:'Assets/images/resin-earrings.jpg'},
  {id:102,name:'Linocut Art Print',cat:'Art & Crafts',price:240,color:'#ede9fe',img:'Assets/images/linocut-art-print.jpg'},
  {id:103,name:'Scented Soy Candle',cat:'Beauty & Wellness',price:185,color:'#fce7f3',img:'Assets/images/scented-soy-candle.jpg'},
  {id:104,name:'Embroidered Bookmark',cat:'Stationery',price:90,color:'#fef3c7',img:'Assets/images/embroidered-bookmark.jpg'},
  {id:105,name:'Crochet Plant Hanger',cat:'Home Decor',price:145,color:'#d1fae5',img:'Assets/images/crochet-plant-hanger.jpg'},
];
function getItems(){ try{return JSON.parse(sessionStorage.getItem('cm_cart_items')||'[]');}catch(e){return[];} }
function saveItems(items){ sessionStorage.setItem('cm_cart_items',JSON.stringify(items)); sessionStorage.setItem('cm_cart',String(items.reduce(function(s,i){return s+i.qty;},0))); }
function getPromo(){ return sessionStorage.getItem('cm_promo')||''; }
function savePromo(c){ c?sessionStorage.setItem('cm_promo',c):sessionStorage.removeItem('cm_promo'); }
function fmt(n){ return '₵'+n.toFixed(2); }
function totals(items){
  var sub=items.reduce(function(s,i){return s+i.price*i.qty;},0);
  var del=sub>=350?(items.length?0:0):(items.length?25:0);
  var p=getPromo(), disc=0;
  if(p&&PROMOS[p]){var pp=PROMOS[p];disc=pp.type==='pct'?Math.round(sub*pp.value/100*100)/100:pp.value;disc=Math.min(disc,sub);}
  return{sub:sub,del:del,disc:disc,total:Math.max(0,sub+del-disc)};
}
function seed(){
  if(getItems().length) return;
  saveItems([
    {id:1,name:'Handcrafted Ceramic Mug',cat:'Art & Crafts',price:220,qty:1,seller:'Emma Wilson',color:'#e2e8f0',img:'Assets/images/handcrafted-ceramic-mug.jpg'},
    {id:3,name:'Custom Illustrated Notebook',cat:'Stationery',price:150,qty:2,seller:'Sofia Rodriguez',color:'#ddd6fe',img:'Assets/images/custom-illustrated-notebook.jpg'},
    {id:6,name:'Handmade Soap Set',cat:'Beauty & Wellness',price:260,qty:1,seller:'Ava Thompson',color:'#fce7f3',img:'Assets/images/handmade-soap-set.jpg'},
  ]);
}

/* ── Sync cart with backend if logged in ── */
function syncCartWithAPI() {
  if (!window.api || !window.api.isLoggedIn()) return;

  // Try to load cart from API
  window.api.getCart()
    .then(function(cart) {
      if (cart && cart.items && cart.items.length > 0) {
        // Merge API cart with local cart
        var apiItems = cart.items.map(function(item) {
          var p = item.product;
          if (!p) return null;
          return {
            id: p._id, name: p.name, cat: p.category,
            price: p.price, qty: item.qty,
            seller: p.sellerName || 'CampusMarket',
            color: p.color || '#e2e8f0',
            img: p.images && p.images.length ? p.images[0] : ''
          };
        }).filter(Boolean);

        if (apiItems.length > 0) {
          saveItems(apiItems);
          if (cart.promo) savePromo(cart.promo);
          renderCart();
        }
      }
    })
    .catch(function() { /* Silently fail — use local cart */ });
}

function renderCart(){
  var items=getItems(), t=totals(items), count=items.reduce(function(s,i){return s+i.qty;},0);
  /* Badges */
  var ib=document.getElementById('itemCountBadge'); if(ib) ib.textContent=count;
  var nb=document.querySelector('.cart-badge'); if(nb) nb.textContent=String(count);
  var st=document.getElementById('cartSummText'); if(st) st.textContent=count?count+' item'+(count!==1?'s':'')+' ready for checkout':'Your cart is empty';
  var cb=document.getElementById('checkoutBtn'); if(cb) cb.disabled=!items.length;
  var list=document.getElementById('cartItemsList'); if(!list) return;
  if(!items.length){
    list.innerHTML='<div class="empty-state"><div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg></div><h3>Your cart is empty</h3><p>Discover unique student-made products.</p><a href="Categories.html" class="btn-browse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>Browse Products</a></div>';
    var as=document.getElementById('alsoSection'); if(as) as.style.display='none';
    updateSummary(t,count); return;
  }
  list.innerHTML=items.map(function(item){
    var img=item.img?'<img src="'+item.img+'" alt="'+item.name+'" onerror="this.style.display=\'none\'">':'';
    return '<div class="cart-item" id="item-'+item.id+'">'+
      '<div class="ci-img" style="background:'+(item.color||'#F3F4F6')+';">'+img+'</div>'+
      '<div><div class="ci-cat">'+item.cat+'</div><div class="ci-name">'+item.name+'</div><div class="ci-seller">by '+item.seller+'</div>'+
      '<div class="ci-actions"><div class="qty-ctrl">'+
        '<button class="qty-btn" onclick="chQty(\''+item.id+'\',-1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>'+
        '<span class="qty-num" id="qty-'+item.id+'">'+item.qty+'</span>'+
        '<button class="qty-btn" onclick="chQty(\''+item.id+'\',1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>'+
      '</div>'+
      '<button class="rm-btn" onclick="rmItem(\''+item.id+'\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2"/></svg>Remove</button>'+
      '</div></div>'+
      '<div class="ci-price-col"><div class="ci-price" id="price-'+item.id+'">'+fmt(item.price*item.qty)+'</div><div class="ci-unit">'+fmt(item.price)+' each</div></div>'+
    '</div>';
  }).join('');
  renderAlso(items);
  updateSummary(t,count);
}
function updateSummary(t,count){
  var sc=document.getElementById('summaryCount'); if(sc) sc.textContent=count;
  var sv=document.getElementById('subtotalVal'); if(sv) sv.textContent=fmt(t.sub);
  var dv=document.getElementById('deliveryVal'); if(dv) dv.textContent=t.del===0?(count>0?'Free':'₵0.00'):fmt(t.del);
  var tv=document.getElementById('totalVal'); if(tv) tv.textContent=fmt(t.total);
  var dr=document.getElementById('discRow'),dval=document.getElementById('discVal');
  if(dr) dr.style.display=t.disc>0?'':'none';
  if(dval) dval.textContent='−'+fmt(t.disc);
  var pi=document.getElementById('promoInput'); var pc=getPromo();
  if(pi&&pc&&!pi.value) pi.value=pc;
  if(pc&&PROMOS[pc]){ var pm=document.getElementById('promoMsg'); if(pm){pm.textContent=PROMOS[pc].label+' applied!';pm.className='promo-msg ok';} }
}
function renderAlso(items){
  var as=document.getElementById('alsoSection'), ag=document.getElementById('alsoGrid'); if(!as||!ag) return;
  var ids=items.map(function(i){return i.id;});
  var picks=SUGGESTIONS.filter(function(s){return!ids.includes(s.id);}).slice(0,3);
  if(!picks.length){as.style.display='none';return;}
  as.style.display='';
  ag.innerHTML=picks.map(function(p){
    var img=p.img?'<img src="'+p.img+'" alt="'+p.name+'" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">':'';
    return '<div class="also-card" onclick="addSug('+p.id+')"><div class="also-img" style="background:'+p.color+';">'+img+'</div><div class="also-info"><div class="also-name">'+p.name+'</div><div class="also-price">'+fmt(p.price)+'</div><div class="also-cta">+ Add</div></div></div>';
  }).join('');
}
window.addSug=function(id){var p=SUGGESTIONS.find(function(s){return s.id===id;});if(!p)return;var items=getItems();var f=items.find(function(i){return i.id===p.id;});if(f)f.qty++;else items.push({id:p.id,name:p.name,cat:p.cat,price:p.price,qty:1,seller:'CampusMarket',color:p.color,img:p.img});saveItems(items);renderCart();window.showToast('"'+p.name+'" added!');};
window.chQty=function(id,d){var items=getItems();var item=items.find(function(i){return String(i.id)===String(id);});if(!item)return;item.qty+=d;if(item.qty<1){rmItem(id);return;}saveItems(items);var qe=document.getElementById('qty-'+id);if(qe)qe.textContent=item.qty;var pe=document.getElementById('price-'+id);if(pe){pe.textContent=fmt(item.price*item.qty);pe.style.transform='scale(1.2)';setTimeout(function(){pe.style.transform='';},250);}var t=totals(items);var c=items.reduce(function(s,i){return s+i.qty;},0);updateSummary(t,c);var ib=document.getElementById('itemCountBadge');if(ib)ib.textContent=c;var nb=document.querySelector('.cart-badge');if(nb)nb.textContent=String(c);};
window.rmItem=function(id){var items=getItems();var item=items.find(function(i){return String(i.id)===String(id);});var row=document.getElementById('item-'+id);if(row){row.style.transition='opacity .25s,transform .25s';row.style.opacity='0';row.style.transform='translateX(16px)';setTimeout(function(){items=items.filter(function(i){return String(i.id)!==String(id);});saveItems(items);renderCart();},240);}else{items=items.filter(function(i){return String(i.id)!==String(id);});saveItems(items);renderCart();}if(item)window.showToast('"'+item.name+'" removed.');};
window.clearCart=function(){if(!getItems().length)return;if(!confirm('Remove all items from your cart?'))return;saveItems([]);savePromo('');renderCart();window.showToast('Cart cleared.');};
window.applyPromo=function(){var inp=document.getElementById('promoInput');var code=(inp?inp.value.trim().toUpperCase():'');var pm=document.getElementById('promoMsg');if(!code){if(pm){pm.textContent='Please enter a promo code.';pm.className='promo-msg err';}return;}if(PROMOS[code]){savePromo(code);if(pm){pm.textContent=PROMOS[code].label+' applied! 🎉';pm.className='promo-msg ok';}window.showToast('Promo "'+code+'" applied!');updateSummary(totals(getItems()),getItems().reduce(function(s,i){return s+i.qty;},0));}else{savePromo('');if(pm){pm.textContent='Invalid code. Try STUDENT10, CAMPUS20, FLAT50, or NEWUSER.';pm.className='promo-msg err';}updateSummary(totals(getItems()),getItems().reduce(function(s,i){return s+i.qty;},0));}};

window.goCheckout=function(){
  if(!getItems().length){window.showToast('Add some items first!');return;}

  /* If logged in, create order via API */
  if (window.api && window.api.isLoggedIn()) {
    var btn = document.getElementById('checkoutBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }

    window.api.createOrder({
      address: '',
      phone: '',
      note: ''
    })
      .then(function(order) {
        saveItems([]);
        savePromo('');
        window.showToast('Order placed successfully! 🎉');
        setTimeout(function() { window.location.href = 'account.html'; }, 1000);
      })
      .catch(function(err) {
        if (btn) { btn.disabled = false; btn.textContent = 'Proceed to Checkout'; }
        /* Fallback: go to checkout page */
        window.location.href = 'Checkout.html';
      });
  } else {
    window.location.href = 'Checkout.html';
  }
};

document.addEventListener('DOMContentLoaded',function(){
  seed(); renderCart();
  syncCartWithAPI();
  var pi=document.getElementById('promoInput'); if(pi) pi.addEventListener('keydown',function(e){if(e.key==='Enter')window.applyPromo();});
});