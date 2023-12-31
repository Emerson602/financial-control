const app = {
    data() {
        return {
            transactionInput: '',                        
            descriptionInput: '',
            homeButton: false, 
            typeInput: '',
            valueInput: '',
            transactionList: [],
            dateTime: '', 
            financialIncome: localStorage.getItem("financialIncome") || 0,
            financialExpenses: localStorage.getItem("financialExpenses") || 0, 
            amount: parseInt(),
            currentDateTime: new Date(), 
            numberTransaction: parseInt(localStorage.getItem("number-transaction") || 0),  
            applyColor: 'success',
            historyType: '', 
            headerVisible: false,                                          
        }
    },
    methods: {

        getCurrentDateTime() {
            setInterval(() => {                  
                  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};                  
                  const formattedDateTime = this.currentDateTime.toLocaleDateString('pt-BR', options);                                         
                  localStorage.setItem("dateTime", formattedDateTime);
                  this.dateTime = localStorage.getItem("dateTime")                                 
            }, 1000) 
         }, 
        setCurrentYear() {            
            const footer = document.querySelector('#footer');   
            
            footer.innerText = `Financial control © - ${this.currentDateTime.getFullYear()}`
        },
        scrollToHome() {
            const home = document.querySelector('#app')
            home.scrollIntoView({ behavior: 'smooth' });       
        },
        scrollToForm() {
            const form = document.querySelector('#transaction-form')
            form.scrollIntoView({ behavior: 'smooth' });    

            this.homeButton = false
            this.showHomeButton()                         
        },
        scrollToHistoric() {
            const historic = document.querySelector('#historic')
            historic.scrollIntoView({ behavior: 'smooth' });

            this.homeButton = false
            this.showHomeButton()       
        },
        checkTransaction() {
            if(this.numberTransaction <= 0) {
                this.noTransaction = !this.noTransaction; 
            } 
        },    
        showHomeButton() {
            this.homeButton = !this.homeButton;
        },
        handleHeaderIntersection(entries) {
            entries.forEach(entry => {
              if (entry.isIntersecting) {               
                this.headerVisible = true;
                this.handleHeaderVisibility();
              } else {                
                this.headerVisible = false;                
              }
            });

          },
          handleHeaderVisibility() {
            this.homeButton = true
            this.showHomeButton()
          },           
        getTransactionHistory() {
           this.transactionList = [];           

            let count = 0;

            for (let i = 0; i < this.numberTransaction; i++) {
                count += 1;
                 
                const transactionDate = localStorage.getItem(`transaction-date-${count}`, this.dateTime);
                const transactionDescription = localStorage.getItem(`transaction-description-${count}`, this.descriptionInput);
                const transactionType = localStorage.getItem(`transaction-type-${count}`, this.typeInput);
                const transactionValue = localStorage.getItem(`transaction-value-${count}`, this.valueInput);              
                
                this.historyType = transactionType;

                this.setColor();
   
                this.transactionList.push(`  
                  <div class="d-flex flex-column align-items-center justify-content-center bg-light p-3 border-5 border-start-0 border-start-top border-bottom-0 border-top-0 rounded mt-2  border border-${this.applyColor}">    
                    
                    <span id="data" class="text-center">${transactionDate}</span>   
                    <span class="mt-2">Descrição: </span>                      
                    <span class="mt-1 text-start text-sm-center fw-bold">${transactionDescription}</span>
                    <span class="mt-2 text-start text-sm-center">Tipo: ${transactionType}</span> 

                    <div class="d-flex flex-row align-items-center justify-content-center">
                        <span class="m-2">Valor: </span>               
                        <span id="historical-transaction-value" class="text-start text-sm-center text-${this.applyColor} fw-bold"> ${transactionValue}</span>
                    </div>
                    
                  </div>                                             
                `);                
            }  

        }, 
        setColor() {            
            if(this.historyType === 'Despesa') {
                this.applyColor = 'danger'               
                return
            }
           
            if(this.historyType === 'Receita'){
                this.applyColor = 'success'
            }
        },
        newTransaction() {         

            if(this.descriptionInput !== '' && this.typeInput === 'Receita' && this.valueInput !== '' && this.valueInput > 0 && !isNaN(this.valueInput)) {   
                this.financialIncome += parseInt(this.valueInput)             
                                          
            } else if(this.descriptionInput !== '' && this.typeInput === 'Despesa' && this.valueInput !== '' && this.valueInput > 0 && !isNaN(this.valueInput)) {  
                this.financialExpenses += parseInt(this.valueInput)                   
                
            } else {
                alert('Preencha todos os campos corretamente!')
                return
            }

            this.storeData() 
            this.scrollToHome() 
            this.checkTransaction()              
            this.reload()  
            this.currentBalance()              
 
        },         
        storeData() {
                this.numberTransaction += 1;
                    
                localStorage.setItem(`transaction-date-${this.numberTransaction}`, this.dateTime); 
                localStorage.setItem(`transaction-description-${this.numberTransaction}`, this.descriptionInput);
                localStorage.setItem(`transaction-type-${this.numberTransaction}`, this.typeInput);
                localStorage.setItem(`transaction-value-${this.numberTransaction}`, this.valueInput);
                localStorage.setItem("number-transaction", this.numberTransaction);  

                this.getTransactionHistory()
        },
        currentBalance() {                         
            localStorage.setItem("financialIncome", this.financialIncome);
            localStorage.setItem("financialExpenses", this.financialExpenses);

            this.financialIncome = parseInt(localStorage.getItem("financialIncome"));
            this.financialExpenses = parseInt(localStorage.getItem("financialExpenses"));  
        
            this.amount = this.financialIncome - this.financialExpenses;          

        },
        showCurrentBalance() {
            const currentBalance = document.querySelector('#current-balance');
            const financialIncome = document.querySelector('#financial-income');
            const financialExpenses = document.querySelector('#financial-expenses');       

            let amountString = this.amount;
            let financialExpensesString = this.financialExpenses;
            let financialIncomeString = this.financialIncome;
             
            
            const formatNumber = (value) => {
                const options = {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                };
                return value.toLocaleString('pt-BR', options);
              };
            
              currentBalance.textContent = formatNumber(amountString);
              financialIncome.textContent = formatNumber(financialIncomeString);
              financialExpenses.textContent = formatNumber(financialExpensesString);  

        },
        reload() {
            setTimeout(() => {
                location.reload()
            }, 1000); 
        },              
    },
    mounted() {       
       this.getCurrentDateTime()
       this.checkTransaction()
       this.setCurrentYear()
       this.getTransactionHistory()
       this.currentBalance()
       this.showCurrentBalance()  
       
       const headerElement = this.$refs.headerElement;

       const observer = new IntersectionObserver(this.handleHeaderIntersection, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0, 
      });

        observer.observe(headerElement);
    }
}

Vue.createApp(app).mount('#app');