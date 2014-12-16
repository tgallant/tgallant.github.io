---
title: FreeBSD Home VPN Client Configuration
layout: post
category: nix
---

**[Note]: Jump [here](#pf) if you can't access your computer outside
  of your network with VPN running**

In this post I will walk through the steps of setting up a VPN client on
your FreeBSD desktop/home server. This tutorial assumes that you have
a VPN provider. If you don't have one, I recommend
[privateinternetaccess](https://privateinternetaccess.com). 

#OpenVPN

To install OpenVPN, run the following command:

    sudo portmaster security/openvpn

Add the following lines to your `/etc/rc.conf`:

    openvpn_configfile="/usr/local/etc/openvpn/uswest.ovpn"
    openvpn_enable="YES"

The first line sets the path for the OpenVPN config file. Change the
path to meet your needs. I recommend copying the config file
provided by your VPN service to `/usr/local/etc/openvpn/`. The second
line sets OpenVPN to start at boot time.

Next, start OpenVPN and enter in your credentials:

    sudo service openvpn start

At this point, OpenVPN should be started. You can verify by going to
[canihazip.com](http://canihazip.com). The IP address it shows should
be different than your home IP.

If you are setting this up on a headless server, you can verify the
VPN is running by executing the following:

    curl http://canihazip.com/s

<a name="pf"></a>
#PF

All outbound traffic should now be going through the VPN tunnel. One
drawback of this is that any response to server requests via
your home IP will be routed through the VPN tunnel. This means that
you won't be able to access this computer from outside of your
network. If you want to be able to SSH into your box or utilize any
other service, you'll have to add some PF commands.

If you already have a `pf.config`, add the following were `$ext_if` is
your physical interface and `$ext_gw` is the internal IP of your router:

    pass in quick on $ext_if reply-to($ext_if $ext_gw) proto icmp to $int_ip keep state
    pass in quick on $ext_if reply-to($ext_if $ext_gw) proto tcp to $int_ip port 22 keep state
    pass in on $ext_if reply-to($ext_if $ext_gw) to $int_ip keep state

This configuration will allow your server to respond to pings and
accept SSH connections through your home IP. Copy the second line and
change the port if you want to open other ports.

If you don't have a config, copy the file below and paste it in
`/etc/pf.conf`. Make sure the interface names match for your system.
For `$ext_gw` use the internal IP of your router and for $int_ip use
the internal IP address of your computer.

<pre><code>
# vim: set ft=pf
# /etc/pf.conf

ext_if = "em0" # physical interface
tun_if = "tun0" # vpn tunnel interface
ext_gw = "xxx.xxx.xxx.xxx" # ip address of the router
int_ip = "xxx.xxx.xxx.xxx" # ip address of this machine

icmp_types_ext_if="{ echoreq }" # ping

set loginterface $ext_if

### normalization
scrub in all random-id fragment reassemble

set skip on lo0

block return in log all
block out all

antispoof quick for $ext_if

### block anything coming from sources that we have no back routes for.
block in from no-route to any

block in from urpf-failed to any

### drop broadcast requests quietly.
block in quick on $ext_if from any to 255.255.255.255
block in quick on $ext_if proto tcp flags FUP/WEUAPRSF
block in quick on $ext_if proto tcp flags WEUAPRSF/WEUAPRSF
block in quick on $ext_if proto tcp flags SRAFU/WEUAPRSF
block in quick on $ext_if proto tcp flags /WEUAPRSF
block in quick on $ext_if proto tcp flags SR/SR
block in quick on $ext_if proto tcp flags SF/SF

### allow outbound traffic
pass out on $ext_if proto { tcp, udp, icmp } from any to any modulate state
pass out on $tun_if proto { tcp, udp, icmp } from any to any modulate state

### allow inbound traffic, routing responses to the physical interface
pass in quick on $ext_if reply-to($ext_if $ext_gw) proto icmp to $int_ip keep state
pass in quick on $ext_if reply-to($ext_if $ext_gw) proto tcp to $int_ip port 22 keep state
pass in on $ext_if reply-to($ext_if $ext_gw) to $int_ip keep state
</code></pre>

Now we'll have to enable pf and start the service. To
enable pf, run:

    sudo echo 'pf_enable="YES"' >> /etc/rc.conf

To start pf, run:

    sudo service pf start

You should now have a working VPN connection and a pf configuration
that allows you to access this computer from outside your
network. If you have any comments or questions, let me know below.


