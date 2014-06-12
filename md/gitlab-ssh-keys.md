Fix for public key auth failiure in gitlab
------------------------------------------

The following is what allowed me to authenticate with git via ssh with a public key. I am using a $5/mo DigitalOcean droplet running the gitlab one click install (Ubuntu 14.04). I don't know if this will help with other setups as well, but its worth a shot.

So you just added your public key to your gitlab profile and you still get the authentication failed (public key) error. In my case, this was caused by the git user's account being locked. To unlock the account you will need to edit the `/etc/shadow` file.

    sudo vi /etc/shadow

Look through this file for the git user and change this:
    
    git:!:16233:0:99999:7:::

to this:

    git:*:16233:0:99999:7:::

All you need to do is change the exclamation point in the second part of the string to an asterisk. The asterisk in this case allows for login means other than password authentication (i.e. public key). The exclamation point actually locks the account from being accessed in any way whatsoever.
