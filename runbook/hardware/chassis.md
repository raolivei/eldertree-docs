# Physical chassis assembly

Mechanical design for the ElderTree portable tower lives in [**eldertree-chassis**](https://github.com/raolivei/eldertree-chassis) (OpenSCAD). This page covers **operations** only; dimensions and STL exports are not duplicated here.

## Stack (bottom → top)

1. EcoFlow River 3 in printed cradle
2. TL-SG1008MP on switch shelf (AC from River 3)
3. Pi backplane on M4 rods
4. Three blade carriers (Pi 5 + NVMe PoE+ HAT each)
5. 120 mm top exhaust fan

## Power-on order

1. Enable River 3 AC output
2. Wait for switch boot and PoE negotiation
3. If all nodes fail to power together, connect one Pi first, then insert remaining blades

PoE budget: 153 W on TL-SG1008MP; three Pi 5 nodes with PoE+ HAT is within spec under normal load.

## Cabling

| Interface | Purpose | Network |
|-----------|---------|---------|
| eth0 | Cluster / etcd traffic | `10.0.0.1`–`.3` via switch |
| wlan0 | Management, VIP, internet | `192.168.2.101`–`.103` |

Use **short rear patch cables** from each Pi to the switch. See [GIGABIT_NETWORK_SETUP](https://github.com/raolivei/pi-fleet/blob/main/docs/GIGABIT_NETWORK_SETUP.md) in pi-fleet.

## CAD and prints

| Resource | Link |
|----------|------|
| Assembly steps | [eldertree-chassis/docs/assembly.md](https://github.com/raolivei/eldertree-chassis/blob/main/docs/assembly.md) |
| Caliper checklist | [measurement-checklist.md](https://github.com/raolivei/eldertree-chassis/blob/main/docs/measurement-checklist.md) |
| Latest STLs | [Actions → Export STL → Artifacts](https://github.com/raolivei/eldertree-chassis/actions/workflows/export-stl.yml) |
| pi-fleet pointer | [HARDWARE_CHASSIS.md](https://github.com/raolivei/pi-fleet/blob/main/docs/HARDWARE_CHASSIS.md) |

## Symptoms (physical)

| Symptom | Check |
|---------|--------|
| Node no link lights on eth0 | Patch cable, switch port, blade seated in carrier |
| PoE drops on boot | Stagger power-on; see switch PoE auto-recovery |
| Overheating | Open frame sides clear; HAT fan thresholds in pi-fleet Ansible |

## Related

- [NET-001: Network connectivity](/runbook/issues/network/NET-001)
- [NODE-001: Node troubleshooting](/runbook/issues/node/NODE-001)
