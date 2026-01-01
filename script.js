
const STORAGE_KEY = "pm_products_v1";

function loadProducts(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}

function saveProducts(products){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function ensureSeedProducts(){
  const products = loadProducts();
  if(products.length) return;
  // بيانات افتراضية
  saveProducts([
    { name:"منتج 1", item:"1001", barcode:"123456", qty:10, price:5000, desc:"وصف المنتج" },
    { name:"منتج 2", item:"1002", barcode:"234567", qty:5, price:7000, desc:"" }
  ]);
}

function findProductByBarcode(barcode){
  const products = loadProducts();
  return products.find(p => String(p.barcode) === String(barcode)) || null;
}

function upsertProduct(product){
  const products = loadProducts();
  const idx = products.findIndex(p => String(p.barcode) === String(product.barcode));
  if(idx >= 0){
    products[idx] = { ...products[idx], ...product };
  }else{
    products.push(product);
  }
  saveProducts(products);
}

/* البحث في products.html */
function searchProduct(){
  let input=document.getElementById("search").value.toLowerCase();
  let rows=document.querySelectorAll("#productTable tr");
  rows.forEach((r,i)=>{
    if(i===0) return;
    r.style.display=r.innerText.toLowerCase().includes(input)?"":"none";
  });
}

/* (اختياري) دالة لعرض المنتجات من LocalStorage في products.html */
function renderProductsTable(){
  const table = document.getElementById("productTable");
  if(!table) return;

  ensureSeedProducts();
  const products = loadProducts();

  // امسح كل الصفوف عدا الهيدر
  const header = table.querySelector("tr");
  table.innerHTML = "";
  table.appendChild(header);

  products.forEach(p=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name||""}</td>
      <td>${p.item||""}</td>
      <td>${p.barcode||""}</td>
      <td>${p.qty ?? ""}</td>
      <td>${p.price ?? ""}</td>
    `;
    table.appendChild(tr);
  });
}
