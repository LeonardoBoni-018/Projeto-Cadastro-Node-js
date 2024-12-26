// requerir os modulos
const express = require('express')
const exphbs = require('express-handlebars')

// requerir o pool
const conn = require('./db/conn')

// importar o model
const User = require('./models/User')
const Address = require('./models/Adress')

// executar express
const app = express()

// configurar express para pegar o body
app.use(
    express.urlencoded({
        extended:true
    })
)

app.use(express.json())

// config handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// arquivos estaticos
app.use(express.static('public'))


// rota para adicionar ususarios
app.get('/users/create', (req,res) => {
    res.render('adduser')
})

// rota para enviar dados do usuario
app.post('/users/create', async (req, res) => {
    // salva os dados em variáveis
    const name = req.body.name;
    const occupation = req.body.occupation;
    let newsLetter = req.body.newsletter;

    // verifica o valor do checkbox
    if (newsLetter === 'on') {
        newsLetter = true;
    } else {
        newsLetter = false;
    }

    console.log(req.body);

    try {
        // função que cria o usuário
        await User.create({ name, occupation, newsLetter });
        res.redirect('/');
    } catch (error) {
        console.log('Erro ao criar usuário:', error);
        res.status(500).send('Erro ao criar usuário');
    }
});



// criar rota com id dinamico do ver detalhes na home
app.get('/users/:id', async(req,res) => {

    // pegar o valor do id do user
    const id = req.params.id

    // resgatar um usuario pelo id
    const user = await User.findOne({raw: true ,where: {id: id}})

    // renderizar view
    res.render('userview', {user})

})

// rota para excluir usuario especifico de acordo com o id
app.post('/users/delete/:id',async(req,res) => {
    // salvar id na variavel
    const id = req.params.id

    // excluir ususario pelo id
    await User.destroy({ where: {id: id}})
    

    // redireciona para home
    res.redirect('/')

    console.log('usuário exlcuido com sucesso!')
})


// rota para editar usuario de acordo pelo id
app.get('/users/edit/:id',async(req,res) => {
    // salvar id na variavel
    const id = req.params.id

    try{
        // editar ususario pelo id
    // remover o raw para n juntar os dados relacionados em um array só
    // adicionar o include
    const user = await User.findOne({include: Address, where: {id: id}})
    

    // renderiza view de ediçao
    // adicionar o metodo get 
    res.render('useredit', {user: user.get({plain: true})})

    console.log('usuário editado com sucesso!')
    } 
    catch(erro){
        console.log(`Houve um erro: ${erro}`)
    }
})

// rota para atualizar os dados do banco
app.post('/users/update', async(req,res) => {

    // salvar tudo que vem do body em variaveis
    const id = req.body.id
    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = req.body.newsletter

    // verifica o valor de newsltter
    if(newsletter === 'on'){
        newsletter = true
    } else{
        newsletter = false
    }

    // salvar tudo em um objeto
    const userData = {
        id,
        name,
        occupation,
        newsletter
    }

    // passar o metodo update com o filtro e o objeto
    await User.update(userData, {where: {id:id}} )

    console.log('Usuario eidtado com sucesso')

    res.redirect('/')
})

// rota para adicionar endereço na tabela relacionada
app.post('/addres/create', async(req,res) => {

    // salvar dados do body em variaveis
    const UserId = req.body.UserId
    const street = req.body.street
    const number = req.body.number
    const city = req.body.city

    // salavar tudo em um objeto
    const addres = {
        UserId,
        street,
        number,
        city
    }

    // criar a chamada de addres
    await Address.create(addres)
    res.redirect(`/users/edit/${UserId}`)
})

// rota para remover dados relacionados
app.post('/address/delete', async(req,res) => {
    // pegar o id do user id
    const UserId = req.body.UserId

    // pegar o id
    const id = req.body.id

    // metodo para excluir
    await Address.destroy({
        // determino oque ele vai excluir
        where: {id:id}
    })

    res.redirect(`/users/edit/${UserId}`)
})


// rota principal
app.get('/', async(req,res) => {

    // variavel siga apenas quando os ususarios chegarem aqui
    const users = await User.findAll({raw: true})

    console.log(users)

    // passa os dados lidos para a render
    res.render('home', {users: users})
})


// executar e criar a tabela
conn.
sync()
// force:true
// sync({force:true})
.then(() => {
    app.listen(3000)
}).catch(() => {
    console.log(`Houve um erro`)
})