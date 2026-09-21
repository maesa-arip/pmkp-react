#!/usr/bin/env bash
set -euo pipefail
umask 077

# Run as the Linux user that owns the production checkout.
# prepare: generate the server key; connect: verify GitHub and configure checkout.
mode="${1:-prepare}"
repo_dir="${2:-$PWD}"
repo_url='git@github.com:maesa-arip/pmkp-react.git'
key_dir="$HOME/.ssh/simdalin-production"
key_file="$key_dir/id_ed25519"
ssh_config="$key_dir/config"

fail() { printf '%s\n' "$*" >&2; exit 1; }

case "$mode" in
    prepare|connect) ;;
    *) fail 'Usage: bash setup-deploy-key.sh prepare|connect [production-checkout]' ;;
esac

command -v ssh-keygen >/dev/null || fail 'OpenSSH is required.'
if [[ "$mode" == prepare ]]; then
    mkdir -p "$key_dir"
    chmod 700 "$key_dir"
    if [[ ! -e "$key_file" ]]; then
        [[ ! -e "$key_file.pub" ]] || fail 'Public key already exists without its private key; inspect it before continuing.'
        ssh-keygen -q -t ed25519 -N '' -C 'simdalin-production-readonly' -f "$key_file"
    fi
    chmod 600 "$key_file"
    # Derive the public key from the private key, including on repeated runs.
    ssh-keygen -y -P '' -f "$key_file" > "$key_file.pub"
    printf '\nAdd this PUBLIC key to GitHub > maesa-arip/pmkp-react > Settings > Deploy keys.\n'
    printf 'Title: simdalin-production; leave Allow write access unchecked.\n\n'
    cat "$key_file.pub"
    printf '\nFingerprint: '
    ssh-keygen -lf "$key_file.pub"
    printf '\nAfter registering the public key, run: bash setup-deploy-key.sh connect /path/to/production\n'
    exit 0
fi

[[ -f "$key_file" ]] || fail 'Run prepare on this server first.'
command -v git >/dev/null || fail 'Git is required.'
cd "$repo_dir"
[[ "$(git rev-parse --show-toplevel)" == "$(pwd -P)" ]] || fail 'Choose the root of the production checkout.'
existing_url="$(git remote get-url origin)"
case "$existing_url" in
    https://github.com/maesa-arip/pmkp-react.git|https://github.com/maesa-arip/pmkp-react|git@github.com:maesa-arip/pmkp-react.git) ;;
    *) fail 'Origin does not match maesa-arip/pmkp-react; inspect the checkout first.' ;;
esac

# Pin the host key published by GitHub, rather than trusting ssh-keyscan output.
# https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints
printf '%s\n' 'github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl' > "$key_dir/known_hosts"
cat > "$ssh_config" <<EOF
Host github.com
    HostName github.com
    User git
    IdentityFile "$key_file"
    IdentitiesOnly yes
    IdentityAgent none
    BatchMode yes
    StrictHostKeyChecking yes
    HostKeyAlgorithms ssh-ed25519
    UserKnownHostsFile "$key_dir/known_hosts"
    GlobalKnownHostsFile /dev/null
    ConnectTimeout 15
EOF

# Quote the config path for the shell used by Git.
quoted_config="${ssh_config//\'/\'\\\'\'}"
ssh_command="ssh -F '$quoted_config'"
# A successful ls-remote verifies this particular key can read the main branch.
GIT_SSH_COMMAND="$ssh_command" git ls-remote --exit-code "$repo_url" refs/heads/main
git config --local core.sshCommand "$ssh_command"
git remote set-url origin "$repo_url"
printf '\nDeploy key connected. Production origin now reads from GitHub through its own key.\n'
printf 'No application files have been deployed. See docs/DEPLOYMENT.md for the release steps.\n'
