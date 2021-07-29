
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('roles').del()
    .then(function () {
      // Inserts seed entries
      return knex.insert([
        {
          title: 'Administrator',
          permissions: JSON.stringify([
            'canCreateTests', 'canWatchOtherUsersTests', 'canEditOtherUsersTests', 'canDeleteOtherUsersTests',
            'canEditOtherUsersAccounts', 'canDeleteOtherUsersAccounts'
          ])
        }, 
        {
          title: 'Operator',
          permissions: JSON.stringify(['canCreateTests'])
        }
      ]).into('roles');
    });
};
