<script lang="ts">
  import Contact from './Contact.svelte';

  const contact1 = {
    profilePhoto: 'https://api.multiavatar.com/Test5.png',
    online: true,
    username: 'BloodyBogan',
    lastMessage: 'That was so cool, though!'
  };

  const contact2 = {
    profilePhoto: 'https://api.multiavatar.com/Test6.png',
    online: false,
    username: 'BloodyBogan2',
    lastMessage: 'That was so awesome, though!'
  };

  const contact3 = {
    profilePhoto: 'https://api.multiavatar.com/Test8.png',
    online: false,
    username: 'BloodyBogan3',
    lastMessage: 'That was so adorable, though!'
  };

  const contact4 = {
    profilePhoto: 'https://api.multiavatar.com/Test11.png',
    online: false,
    username: 'BloodyBogan4',
    lastMessage: 'That was so scary, though!'
  };
</script>

<ul class="contact-list">
  <Contact {...contact1} />
  <Contact {...contact2} />
  <Contact {...contact3} />
  <Contact {...contact4} />
</ul>

<style lang="scss">
  .contact-list {
    margin-top: 3.5rem;
  }
</style>
