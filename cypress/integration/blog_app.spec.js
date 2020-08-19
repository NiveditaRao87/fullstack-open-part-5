describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Nivedita Rao',
      username: 'nroar',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Login to blog application')
    cy.contains('username')
    cy.contains('password')
    cy.get('button').should('contain','login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('nroar')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()
      cy.contains('Nivedita Rao logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('nroar')
      cy.get('#password').type('12345')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'nroar', password: 'secret' })
      })

      it('A blog can be created', function() {
        cy.contains('new blog').click()
        cy.get('#title').type('Humane guide to debugging')
        cy.get('#author').type('Juha-Matti Santala')
        cy.get('#url').type('https://hamatti.org/guides/humane-guide-to-debugging/#console-table')
        cy.get('#create-button').click()
        cy.get('.blog-list').should('contain','Humane guide to debugging')
          .and('contain','Juha-Matti Santala')
        cy.get('.notification')
          .should('contain','A new blog Humane guide to debugging by Juha-Matti Santala was added to the list')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid')
      })

      describe('and some blogs exist', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'a very interesting blog',
            author: 'someone smart',
            url: 'https://justgoogleityourself.com',
            likes: 20
          })
          cy.createBlog({
            title: 'another very interesting blog',
            author: 'someone interesting',
            url: 'https://imsureyoullfinditsomewhere.com',
            likes: 10
          })
          cy.createBlog({
            title: 'an awesome blog',
            author: 'someone awesome',
            url: 'https://icantrememberwho.com',
            likes: 5
          })
        })
        it('a blog can be liked', function () {
          cy.contains('another very interesting blog').parent().find('button').click()
          cy.get('#like-button').click()
          cy.contains('likes 11')
        })
        it('a blog created by the user can be deleted', function () {
          cy.contains('a very interesting blog').parent().find('button').click()
          cy.contains('a very interesting blog').parent()
            .should('contain','Nivedita Rao')
            .get('#remove-button').click()
          cy.get('.blog-list').should('not.contain','a very interesting blog')
        })
        it('a blog created by another user cannot be deleted', function() {
          const user = {
            name: 'Trouble Maker',
            username: 'trouble',
            password: 'mischief'
          }
          cy.request('POST', 'http://localhost:3003/api/users/', user)
          cy.login({ username: 'trouble', password: 'mischief' })
          cy.contains('a very interesting blog').parent().find('button').click()
          cy.contains('a very interesting blog').parent()
            .should('not.contain','Trouble Maker')
            .and('not.contain','remove')
        })
        it('the blogs are sorted by the number of likes', function() {
          cy.get('.view-button').each(button => cy.wrap(button).click())
          cy.get('.likes').then(likes => {
            const allLikes = likes.text().split('likes ').slice(1).map(Number)
            expect(Cypress._.isEqual(allLikes,[...allLikes].sort((a,b) => b-a))).to.be.true
          } )

        })
      })
    })
  })

})