  //#region imports
  import { get } from "../db/dbGate.js";
import * as productDB from "../db/productDB.js";
  import * as userDB from "../db/userDB.js";
  //#endregion

  //#region global variables
  let data =[]
  let searchData =[]
  let rootElement;
  let oldInUpdate = {};
  //#endregion

  // #region DOM Elements
  const componentModal = document.getElementById("componentModal");
  const deleteModal = document.getElementById("deleteModal");
  const addcomponentBtn = document.getElementById("addcomponentBtn");
  const modalTitle = document.getElementById("modalTitle");
  const componentForm = document.getElementById("componentForm"); //componentModal from
  const componentsTableBody = document.getElementById("componentsTableBody"); //where generate the body of the table
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const pagination = document.getElementById("pagination");
  const search = document.getElementById("search-input");

  let savecomponentBtn ;
  const passwordInput = document.getElementById("password");
  const roleInput = document.getElementById("role");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const roleError = document.getElementById("roleError");
  //#endregion

  //#region init
const init =async function (rootE) {
  rootElement = root[rootE];
  SetGlobalItems()
  await paging();
  await generateForms();
  await Events();
}

const SetGlobalItems = function(){
  document.getElementById('headerTitle').innerText = rootElement.class.name +'s Management';
  document.getElementById('addcomponentBtn').nodeValue  ='Add New ' + rootElement.class.name;
}

const Events = async function(){

    componentForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      await savecomponent();
    })

        // Event Listeners
    addcomponentBtn.addEventListener("click", openAddcomponentModal);

    // Close modal when clicking on close button or outside the modal
    document.querySelectorAll(".close-modal").forEach((btn) => {
      btn.addEventListener("click", closeModals);
    });

    componentModal.addEventListener("click", function (e) {
    if (e.target === componentModal) { //it's tack the full width and hights
      closeModals();
    }
    });

    deleteModal.addEventListener("click", function (e) {
    if (e.target === deleteModal) { //it's tack the full width and hights
      closeModals();
    }
    });

    search.addEventListener('input',function(e){
      if(search.value.trim() == '') 
        searchData = data; 
      else
      searchData = data.filter(ar => {
        for (const field of rootElement.fields) {
            if(ar[field.name].toString().includes(search.value.trim()))return true;
        }
    });
      paging(true);
    })
    confirmDeleteBtn.addEventListener("click", await deletecomponent);
}
  //#endregion

  // #region generateTable
const paging = async function(search=false){
    if(data.length ==0 && !search)
    {
      data = await rootElement.GetData();
      searchData = [...data];
    }
    let prc = 5; // page record count
    let bc = Math.ceil(searchData.length / prc) //button count
    renderPaging(prc,bc);
    await GenerateTable(0,prc);
  }

  const renderPaging = async function(prc,bc){
    let html = ''
    for (let i = 1; i <= bc; i++) {
      let from =(i-1)*prc
      html=html+`
      <button class="page-btn ${i==1?'active':''}" frc=${from}>${i}</button>
      `;
    }
    pagination.innerHTML=html;
    //events
    document.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click',async function (e) {
        let from = this.getAttribute('frc');
        GenerateTable(from,parseInt(from)+5);
        
        document.querySelectorAll('.page-btn').forEach(cbtn => {
          // remove class active
          cbtn.classList.remove('active');
        });
        
        //add class active
        btn.classList.add('active');
        
      });
    });
  }

const GenerateTable = async function (from=null, to=null) {
  document.getElementById('tableTitle').innerText = "All " + rootElement.class.name + "s" 
  let fields = rootElement.fields;
    let tableHeader = document.getElementById('tableHeader');
    tableHeader.innerHTML = '';
    for (const field of fields) {
      if(field.hidden) continue;
        let th = document.createElement('th');
        th.innerText = field.name;
        tableHeader.appendChild(th);
    }
    let th = document.createElement('th');
    th.innerText ='Actions';
    tableHeader.appendChild(th);
    
    //////////////////////////////////////////////////////////////////////////////

    from = from ==null ? 0 : from;
    from = from<0?0:from;
    to = to ==null ? searchData.length : to;
    componentsTableBody.innerHTML = "";
    searchData.slice(from, to).forEach((ar) => {
        const tr = document.createElement("tr");
        let row =``;
        let fields = rootElement.fields;
      for (const field of fields) {
        if(field.hidden) continue;
        row = row + `<td>${ar[field.name]}</td>`
    }
      row = row+`
                
                <td>
                    <div class="action-btns">
                        <button class="btn btn-sm btn-outline edit-btn" data-id="${
                          ar.id
                        }">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline delete-btn" data-id="${
                          ar.id
                        }">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </div>
                </td>
            `;
            tr.innerHTML = row;
      componentsTableBody.appendChild(tr);
    });

    // Add event listeners to the edit and delete buttons
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const componentId = this.getAttribute("data-id"); //we added custom attribute - we made it here
        openEditcomponentModal(componentId);
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const componentId = this.getAttribute("data-id");
        openDeleteModal(componentId);
      });
    });
}
// #endregion
  
  // #region Generate Forms
const generateForms = async function() {
  let componentFormHTML = '';
  for (const field of rootElement.fields) {
    if(!field.enable) continue; 
    if(!(field.type.toLowerCase().includes("option"))){componentFormHTML = componentFormHTML+ `
    <div class="form-group">
      <label for="${field.name}id">${field.name}</label>
      <input
        type="${field.type}"
        id="${field.name}id"
        pattern="${field.regex}"
        class="form-control"
        placeholder="Enter ${field.name}"
      />
      <span id="${field.name}Error" class="error-message"
        >Please enter a valid ${field.name}</span
      >
    </div>`;
    }
    else {
      componentFormHTML = componentFormHTML+ `
    <div class="form-group">
      <label for="${field.name}id">${field.name}</label>
      <select id="${field.name}id" class="form-select">
        AutoOptions
      </select>
      <span id="${field.name}Error" class="error-message"
        >Please enter a valid ${field.name}</span
      >
    </div>`;
    let AutoOptions = '';
    for (const op of await field.getOptions()) {
      AutoOptions = AutoOptions + `<option value="${op}">${op}</option>`
    }
    componentFormHTML = componentFormHTML.replace('AutoOptions',AutoOptions)
  }
  }

  // add this to the tree
  componentFormHTML = componentFormHTML + `
  <div class="modal-footer">
    <button class="btn btn-outline close-modal">Cancel</button>
    <button
      type="submit"
      id="savecomponentBtn"
      class="btn btn-primary"
    >
      Save ${rootElement.class.name}
    </button>
</div>
`;
componentForm.innerHTML = componentFormHTML;
savecomponentBtn = document.getElementById("savecomponentBtn");
savecomponentBtn.addEventListener("click", await savecomponent);
  //another loop for events
  for (const field of rootElement.fields) {
    if(!field.enable) continue; 
    let fieldElement = document.getElementById(field.name+'id');
    let errorElement = document.getElementById(field.name+'Error');
    fieldElement.addEventListener('input',function (e) {
      if (oldInUpdate?.['message']?.[field.name]?.length > 0) {
        errorElement.innerText = oldInUpdate['message'][field.name];
      }
      if(field.regex.test(this.value)){
        errorElement.style.display = 'none';
      }else{
        errorElement.style.display = 'block';
      }
      // oldInUpdate['message'][field.name] = '';
    })
  }
 

}
  //#endregion

  //#region componentModal

  // Clear error messages from the form
  const formClearErrors = function(){
    document.querySelectorAll(".error-message").forEach((el) => {
      el.style.display = "none";
    });
  }
  // Open modal for adding a component
  function openAddcomponentModal() {
    modalTitle.innerText = "Add New "+rootElement.class.name;
    componentForm.reset();
   // document.getElementById("componentId").value = ""; //because this is add new not update
    componentForm.setAttribute('componentIdentifier','');

    // Clear error messages
    formClearErrors();

    // Show the modal
    componentModal.classList.add("active");
  }
  
  // Open modal for editing a component
  function openEditcomponentModal(componentId) {
    //get the component
    const dat = searchData.find((c) => c.id == componentId);
    // if (!component) return;

    //complete component informations
    modalTitle.textContent = "Edit "+rootElement.class.name;
   // document.getElementById("componentId").value = component.id;
    componentForm.setAttribute('componentIdentifier',dat.id);
    for (const field of rootElement.fields) {
      if(!field.enable) continue; 
      let el=document.getElementById(field.name+'id') ;
      el.value = dat[field.name]
      oldInUpdate[field.name] = dat[field.name];
    }

    //full oldInUpdate
    for (const field of rootElement.fields) {
      if(!field.enable) continue; 
      oldInUpdate[field.name] = document.getElementById(field.name+'id').value;
    }

    // Clear error messages
    formClearErrors();

    // Show the modal
    componentModal.classList.add("active");
  }

  // Open delete confirmation modal
  function openDeleteModal(dataId) {
    const dta = searchData.find((d) => d.id == dataId);
    if (!dta) return;

    deleteModal.setAttribute('dataId',dataId)
    deleteModal.classList.add("active");
  }

  // Close any modal
  function closeModals() {
    formClearErrors();
    componentForm.reset();
    componentModal.classList.remove("active");
    deleteModal.classList.remove("active");
  }

  // Save component (add or update)
  async function savecomponent() {
    debugger
    
    //if any have custom validation
    for (const field of rootElement.fields) {
      //if(!field.enable) continue; 
      if(field.customValidation&& oldInUpdate?.[field.name])
      {
        let message = await field.customValidation(this.value,oldInUpdate[field.name])
        let errorElement = document.getElementById(field.name+'Error')
        oldInUpdate['message'] = {};
        oldInUpdate['message'] [field.name] = errorElement.innerText;
        errorElement.innerText = message;
        errorElement.style.display = 'block';
      }
    }
    const componentId = componentForm.getAttribute('componentIdentifier');
    console.log(componentId);
    
    //let u = new component(nameInput.value, emailInput.value, passwordInput.value, roleInput.value)


    if (componentId) {
        //u = new component(nameInput.value, emailInput.value, passwordInput.value, roleInput.value, componentId,components.find(us=>us.id == componentId).orders)

        
        //update component function
        Updatecomponent(u);
    } else {
      // Add new component
      await addcomponent(u);
    }

    closeModals();
    
    await rendercomponentsTable();
  }

  // Delete component
  async function deletecomponent() {
    const dataId = deleteModal.getAttribute('dataId');
    let d = new rootElement.class;
    d['id'] = dataId;
    rootElement.module.Delete(d)
    closeModals();
    await paging();
  }
   
  //#endregion
  
  //#region start

  // must all classes identifire called id
  // get fields from class
  // display is for table - enable is for form
  let root = {
      users:
      {
          module:userDB,
          class: userDB.User,
          fields:[
              {
                  name:"name",
                  type:"text",
                  hidden:false,
                  enable:true,
                  regex:/^.{3,}$/
                  
              },
              {
                  name:"email",
                  type:"email",
                  hidden:false,
                  enable:true,
                  regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  customValidation:async function(newEmail,oldEmail) {
                      if(await userDB.getUserByemail(newEmail, oldEmail) instanceof userDB.User)
                      {
                          return 'this email is taken';   
                      }
                  }
              },
              {
                  name:"pass",
                  type:"password",
                  hidden:true,
                  enable:true,
                  regex:/^.{3,}$/,
              },
              {
                  name:"role",
                  type:"options",
                  hidden:false,
                  enable:true,
                  regex:/^.{1,}$/,
                  getOptions:function() {
                    return ['admin','seller','buyer'];
                  }
              }
          ],
          GetData: async function () {
              return await userDB.get()
          }
      },
      products:
      {
          class: productDB.Product,
          fields:[
              {
                  name:"name",
                  type:"text",
                  hidden:false,
                  enable:true,
                  regex:""
                  
              },
              {
                  name:"price",
                  type:"",
                  hidden:false,
                  enable:true,
                  regex:"",
                  customValidation:function(price) {
                      return price>0 && price<10_000;
                  }
              },
              {
                  name:"cat",
                  type:"",
                  hidden:false,
                  enable:true,
                  regex:"",
                  getOptions:function() {
                    return ['c1','c2','c3'];
                  }
                  
              },
              {
                  name:"img",
                  type:"text",
                  hidden:false,
                  enable:true,
                  regex:"",
                  customValidation:function(file) {
                    // is file is image?
                    return true;
                  }
              },
              {
                  name:"sellerId",
                  type:"text  ",
                  hidden:false,
                  enable:true,
                  regex:"",
                  getOptions:function() {
                    // names
                    return ['seller1','seller2','seller3'];
                  }
              }
          ],
          GetData: async function () {
              return await productDB.get()
          }
      },
  }
  init('users')
  //#endregion