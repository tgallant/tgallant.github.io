---
title: FreeBSD Home VPN Client Configuration
layout: post
category: nix
---

In this post I will walk through the steps of setting up a VPN client on
your FreeBSD desktop/home server.

#OpenVPN

To install OpenVPN, run the following command:

    sudo portmaster security/openvpn

Add the following lines to your `/etc/rc.conf`:

    openvpn_configfile="/usr/local/etc/openvpn/uswest.ovpn"
    openvpn_enable="YES"

The first line sets the path for the OpenVPN config file. Change the
path to meet your needs. The second line sets OpenVPN to start at boot
time. 

#PF

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
