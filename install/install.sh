#!/usr/bin/env bash
set -euo pipefail
APP=x-cli
REPO=${X_CLI_REPO:-sraveshnandan/x-cli}
SOURCE_REF=${X_CLI_SOURCE_REF:-master}

MUTED='\033[0;2m'
RED='\033[0;31m'
ORANGE='\033[38;5;214m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

usage() {
    cat <<EOF
x-cli Installer

Usage: install.sh [options]

Options:
    -h, --help              Display this help message
    -v, --version <version> Install a specific version (e.g., 0.0.1-alpha.38)
    -b, --binary <path>     Install from a local binary instead of downloading
        --from-source       Build from source via git clone + bun (used automatically
                             when no published release is available)
        --no-modify-path    Don't modify shell config files (.zshrc, .bashrc, etc.)

Environment:
    X_CLI_REPO              GitHub repo to fetch releases from (default: sraveshnandan/x-cli)
    X_CLI_SOURCE_REF        Git ref to build when --from-source is used (default: master)
    X_CLI_INSTALL_DIR       Override install directory (highest priority)
    XDG_BIN_DIR             XDG Base Directory Specification compliant path

Examples:
    # From GitHub (auto-builds from source if no release is published)
    curl -fsSL https://raw.githubusercontent.com/sraveshnandan/x-cli/master/install/install.sh | bash

    # Pin to a specific release
    curl -fsSL https://raw.githubusercontent.com/sraveshnandan/x-cli/master/install/install.sh \
        | bash -s -- --version 0.0.1-alpha.38

    # Force build from source
    curl -fsSL https://raw.githubusercontent.com/sraveshnandan/x-cli/master/install/install.sh \
        | bash -s -- --from-source

    # Use a prebuilt local binary
    ./install.sh --binary /path/to/x-cli-cli
EOF
}

requested_version=${X_CLI_VERSION:-}
specific_version=""
no_modify_path=false
binary_path=""
from_source=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            usage
            exit 0
            ;;
        -v|--version)
            if [[ -n "${2:-}" ]]; then
                requested_version="$2"
                shift 2
            else
                echo -e "${RED}Error: --version requires a version argument${NC}"
                exit 1
            fi
            ;;
        -b|--binary)
            if [[ -n "${2:-}" ]]; then
                binary_path="$2"
                shift 2
            else
                echo -e "${RED}Error: --binary requires a path argument${NC}"
                exit 1
            fi
            ;;
        --from-source)
            from_source=true
            shift
            ;;
        --no-modify-path)
            no_modify_path=true
            shift
            ;;
        *)
            echo -e "${ORANGE}Warning: Unknown option '$1'${NC}" >&2
            shift
            ;;
    esac
done

# Pick install dir, in priority order: env override -> $XDG_BIN_DIR -> $HOME/bin -> $HOME/.x-cli/bin
if [ -n "${X_CLI_INSTALL_DIR:-}" ]; then
    INSTALL_DIR="$X_CLI_INSTALL_DIR"
elif [ -n "${XDG_BIN_DIR:-}" ]; then
    INSTALL_DIR="$XDG_BIN_DIR"
elif [ -d "$HOME/bin" ] || { mkdir -p "$HOME/bin" 2>/dev/null && [ -w "$HOME/bin" ]; }; then
    INSTALL_DIR="$HOME/bin"
else
    INSTALL_DIR="$HOME/.x-cli/bin"
fi
mkdir -p "$INSTALL_DIR"

print_message() {
    local level=$1
    local message=$2
    local color=""
    case $level in
        info) color="${NC}" ;;
        warning) color="${ORANGE}" ;;
        error) color="${RED}" ;;
        success) color="${GREEN}" ;;
    esac
    echo -e "${color}${message}${NC}"
}

detect_host() {
    raw_os=$(uname -s)
    os=$(echo "$raw_os" | tr '[:upper:]' '[:lower:]')
    case "$raw_os" in
      Darwin*) os="darwin" ;;
      Linux*) os="linux" ;;
      MINGW*|MSYS*|CYGWIN*) os="windows" ;;
    esac

    arch=$(uname -m)
    if [[ "$arch" == "aarch64" ]]; then
      arch="arm64"
    fi
    if [[ "$arch" == "x86_64" ]]; then
      arch="x64"
    fi

    # Rosetta 2: prefer arm64 on Apple Silicon
    if [ "$os" = "darwin" ] && [ "$arch" = "x64" ]; then
      rosetta_flag=$(sysctl -n sysctl.proc_translated 2>/dev/null || echo 0)
      if [ "$rosetta_flag" = "1" ]; then
        arch="arm64"
      fi
    fi

    case "$os-$arch" in
      darwin-arm64)  host="darwin-arm64" ;;
      darwin-x64)    host="darwin-x64" ;;
      linux-x64)     host="linux-x64-gnu" ;;
      linux-arm64)   host="linux-arm64-gnu" ;;
      windows-x64)   host="windows-x64-msvc" ;;
      *)
        print_message error "Unsupported OS/Arch: $os/$arch"
        print_message warning "Open an issue at https://github.com/${REPO}/issues"
        exit 1
        ;;
    esac
}

detect_host

# --- Source paths ---
if [ -n "$binary_path" ]; then
    if [ ! -f "$binary_path" ]; then
        print_message error "Error: Binary not found at ${binary_path}"
        exit 1
    fi
    specific_version="local"
else
    if [ -z "$requested_version" ]; then
        url="https://github.com/${REPO}/releases/latest/download/x-cli-${host}.tar.gz"
        latest_json=$(curl -fsSL --max-time 15 "https://api.github.com/repos/${REPO}/releases/latest" 2>/dev/null || true)
        if [ -n "$latest_json" ]; then
            specific_version=$(echo "$latest_json" | sed -n 's/.*"tag_name": *"v\?\([^"]*\)".*/\1/p')
        fi
        if [ -z "$specific_version" ]; then
            # No published release yet — auto-fall back to building from source.
            print_message warning "No published release for ${REPO}. Falling back to build from source (${SOURCE_REF})."
            from_source=true
        fi
    else
        # Strip leading 'v' if present
        requested_version="${requested_version#v}"
        url="https://github.com/${REPO}/releases/download/v${requested_version}/x-cli-${host}.tar.gz"
        specific_version=$requested_version
        # Verify release exists via the GitHub API. Curl exits non-zero on 404 with -fsSL.
        if ! curl -fsSL --max-time 15 -o /dev/null "https://api.github.com/repos/${REPO}/releases/tags/v${requested_version}"; then
            print_message error "Error: Release v${requested_version} not found for ${REPO}"
            print_message warning "Available releases: https://github.com/${REPO}/releases"
            exit 1
        fi
    fi
fi

check_version() {
    if command -v x-cli >/dev/null 2>&1; then
        installed_version=$(x-cli --version 2>/dev/null || echo "")
        if [[ "$installed_version" == *"$specific_version"* ]]; then
            print_message info "${MUTED}Version ${NC}$specific_version${MUTED} already installed${NC}"
            exit 0
        fi
        print_message info "${MUTED}Installed version: ${NC}$installed_version"
    fi
}

install_dependencies_for_source() {
    local missing=()
    if ! command -v git >/dev/null 2>&1; then missing+=("git"); fi
    if ! command -v bun >/dev/null 2>&1; then missing+=("bun"); fi
    if [ ${#missing[@]} -ne 0 ]; then
        print_message error "Building from source requires: ${missing[*]}"
        print_message warning "Install them and rerun, or use --binary /path/to/x-cli-cli instead."
        exit 1
    fi
}

build_from_source() {
    print_message info "${MUTED}Building ${NC}x-cli ${MUTED}from source (${SOURCE_REF})...${NC}"
    install_dependencies_for_source

    local build_dir
    build_dir=$(mktemp -d -t x-cli-build-XXXXXX)
    trap "rm -rf '$build_dir'" RETURN

    print_message info "${MUTED}Cloning ${NC}https://github.com/${REPO}.git${MUTED} @ ${NC}${SOURCE_REF}"
    if ! git clone --depth 1 --branch "${SOURCE_REF}" "https://github.com/${REPO}.git" "$build_dir/repo" 2>/dev/null; then
        # Fallback if branch doesn't exist as a branch ref
        git clone --depth 1 "https://github.com/${REPO}.git" "$build_dir/repo"
        (cd "$build_dir/repo" && git checkout "${SOURCE_REF}")
    fi

    # Initialize submodules (inference/native/llama-cpp-rs)
    if [ -f "$build_dir/repo/.gitmodules" ]; then
        print_message info "${MUTED}Initializing submodules...${NC}"
        (cd "$build_dir/repo" && git submodule update --init --depth 1) || true
    fi

    print_message info "${MUTED}Installing dependencies (bun install)...${NC}"
    (cd "$build_dir/repo" && bun install)

    print_message info "${MUTED}Building the CLI launcher (this is the small JS shim, not the ICN binary)...${NC}"
    (cd "$build_dir/repo" && bun run packages/version/scripts/generate-version.ts)

    print_message info "${MUTED}Building x-cli CLI launcher bundle...${NC}"
    (cd "$build_dir/repo" && bun run packages/cli/scripts/prepare-release-runtime.ts)

    # Copy the launcher (x-cli-cli.js — a small Node/Bun-compatible shim) into the install dir.
    local launcher="$build_dir/repo/packages/cli/bin/x-cli.js"
    if [ ! -f "$launcher" ]; then
        print_message error "Build succeeded but launcher not found at $launcher"
        exit 1
    fi

    cp "$launcher" "$INSTALL_DIR/x-cli"
    chmod 755 "$INSTALL_DIR/x-cli"
    specific_version="source-${SOURCE_REF}"
}

unbuffered_sed() {
    if echo | sed -u -e "" >/dev/null 2>&1; then
        sed -nu "$@"
    elif echo | sed -l -e "" >/dev/null 2>&1; then
        sed -nl "$@"
    else
        local pad="$(printf "\n%512s" "")"
        sed -ne "s/$/\\${pad}/" "$@"
    fi
}

print_progress() {
    local bytes="$1"
    local length="$2"
    [ "$length" -gt 0 ] || return 0
    local width=50
    local percent=$(( bytes * 100 / length ))
    [ "$percent" -gt 100 ] && percent=100
    local on=$(( percent * width / 100 ))
    local off=$(( width - on ))
    local filled=$(printf "%*s" "$on" "")
    filled=${filled// /■}
    local empty=$(printf "%*s" "$off" "")
    empty=${empty// /･}
    printf "\r${ORANGE}%s%s %3d%%${NC}" "$filled" "$empty" "$percent" >&4
}

download_with_progress() {
    local url="$1"
    local output="$2"
    if [ -t 2 ]; then
        exec 4>&2
    else
        exec 4>/dev/null
    fi
    local tmp_dir=${TMPDIR:-/tmp}
    local basename="${tmp_dir}/x_cli_install_$$"
    local tracefile="${basename}.trace"
    rm -f "$tracefile"
    mkfifo "$tracefile"
    printf "\033[?25l" >&4
    trap "trap - RETURN; rm -f '$tracefile'; printf '\033[?25h' >&4; exec 4>&-" RETURN
    (
        curl --trace-ascii "$tracefile" -fsSL --max-time 600 -o "$output" "$url"
    ) &
    local curl_pid=$!
    unbuffered_sed \
        -e 'y/ACDEGHLNORTV/acdeghlnortv/' \
        -e '/^0000: content-length:/p' \
        -e '/^<= recv data/p' \
        "$tracefile" | \
    {
        local length=0
        local bytes=0
        while IFS=" " read -r -a line; do
            [ "${#line[@]}" -lt 2 ] && continue
            local tag="${line[0]} ${line[1]}"
            if [ "$tag" = "0000: content-length:" ]; then
                length="${line[2]}"
                length=$(echo "$length" | tr -d '\r')
                bytes=0
            elif [ "$tag" = "<= recv" ]; then
                local size="${line[3]}"
                bytes=$(( bytes + size ))
                if [ "$length" -gt 0 ]; then
                    print_progress "$bytes" "$length"
                fi
            fi
        done
    }
    wait $curl_pid
    local ret=$?
    echo "" >&4
    return $ret
}

download_and_install() {
    print_message info "\n${MUTED}Installing ${NC}x-cli ${MUTED}version: ${NC}$specific_version"
    local tmp_dir="${TMPDIR:-/tmp}/x_cli_install_$$"
    mkdir -p "$tmp_dir"
    local archive="x-cli-${host}.tar.gz"
    if [[ "$os" == "windows" ]] || ! [ -t 2 ] || ! download_with_progress "$url" "$tmp_dir/$archive"; then
        curl -fSL --max-time 600 -o "$tmp_dir/$archive" "$url"
    fi
    tar -xzf "$tmp_dir/$archive" -C "$tmp_dir"
    # The release archive extracts to a binary named `x-cli-cli` (or `x-cli-cli.exe` on Windows)
    if [ "$os" = "windows" ]; then
        mv "$tmp_dir/x-cli-cli.exe" "$INSTALL_DIR/x-cli.exe"
        chmod 755 "$INSTALL_DIR/x-cli.exe"
    else
        mv "$tmp_dir/x-cli-cli" "$INSTALL_DIR/x-cli"
        chmod 755 "$INSTALL_DIR/x-cli"
    fi
    rm -rf "$tmp_dir"
}

install_from_binary() {
    print_message info "\n${MUTED}Installing ${NC}x-cli ${MUTED}from: ${NC}$binary_path"
    cp "$binary_path" "$INSTALL_DIR/x-cli"
    chmod 755 "$INSTALL_DIR/x-cli"
}

if [ -n "$binary_path" ]; then
    install_from_binary
elif [ "$from_source" = true ]; then
    build_from_source
else
    check_version
    download_and_install
fi


add_to_path() {
    local config_file=$1
    local command=$2
    if grep -Fxq "$command" "$config_file"; then
        print_message info "Command already exists in $config_file, skipping write."
    elif [[ -w $config_file ]]; then
        echo -e "\n# x-cli" >> "$config_file"
        echo "$command" >> "$config_file"
        print_message success "Added x-cli to \$PATH in $config_file"
    else
        print_message warning "Manually add the directory to $config_file (or similar):"
        print_message info "  $command"
    fi
}

XDG_CONFIG_HOME=${XDG_CONFIG_HOME:-$HOME/.config}
current_shell=$(basename "$SHELL" 2>/dev/null || echo "sh")
case $current_shell in
    fish)
        config_files="$HOME/.config/fish/config.fish"
    ;;
    zsh)
        config_files="${ZDOTDIR:-$HOME}/.zshrc ${ZDOTDIR:-$HOME}/.zshenv $XDG_CONFIG_HOME/zsh/.zshrc $XDG_CONFIG_HOME/zsh/.zshenv"
    ;;
    bash)
        config_files="$HOME/.bashrc $HOME/.bash_profile $HOME/.profile $XDG_CONFIG_HOME/bash/.bashrc $XDG_CONFIG_HOME/bash/.bash_profile"
    ;;
    ash)
        config_files="$HOME/.ashrc $HOME/.profile /etc/profile"
    ;;
    sh)
        config_files="$HOME/.ashrc $HOME/.profile /etc/profile"
    ;;
    *)
        config_files="$HOME/.bashrc $HOME/.bash_profile $XDG_CONFIG_HOME/bash/.bashrc $XDG_CONFIG_HOME/bash/.bash_profile"
    ;;
esac

if [[ "$no_modify_path" != "true" ]]; then
    config_file=""
    for file in $config_files; do
        if [[ -f $file ]]; then
            config_file=$file
            break
        fi
    done
    if [[ -z $config_file ]]; then
        print_message warning "No config file found for $current_shell. You may need to manually add to PATH:"
        print_message info "  export PATH=$INSTALL_DIR:\$PATH"
    elif [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
        case $current_shell in
            fish)
                add_to_path "$config_file" "fish_add_path $INSTALL_DIR"
            ;;
            zsh)
                add_to_path "$config_file" "export PATH=$INSTALL_DIR:\$PATH"
            ;;
            bash)
                add_to_path "$config_file" "export PATH=$INSTALL_DIR:\$PATH"
            ;;
            ash)
                add_to_path "$config_file" "export PATH=$INSTALL_DIR:\$PATH"
            ;;
            sh)
                add_to_path "$config_file" "export PATH=$INSTALL_DIR:\$PATH"
            ;;
            *)
                export PATH=$INSTALL_DIR:$PATH
                print_message warning "Manually add the directory to $config_file (or similar):"
                print_message info "  export PATH=$INSTALL_DIR:\$PATH"
            ;;
        esac
    fi
fi

if [ -n "${GITHUB_ACTIONS-}" ] && [ "${GITHUB_ACTIONS}" == "true" ]; then
    echo "$INSTALL_DIR" >> $GITHUB_PATH
    print_message info "Added $INSTALL_DIR to \$GITHUB_PATH"
fi

echo -e ""
echo -e "${MUTED}                  ${NC}        ▄      "
echo -e "${MUTED}█ █▀▀ █ █▀▀█ █▀▀█ ${NC}█   █  █ █▀▀█ █  █"
echo -e "${MUTED}█▀▀█  █ █▀▀▀ █▀▀▀ ${NC}█▀▀▀█  █ █  █ █▀▀▀"
echo -e "${MUTED}█ █▀▀ █ ▀▀▀▀ ▀▀▀▀ ${NC}█   █  █ ▀▀▀▀ ▀▀▀▀"
echo -e ""
echo -e "${MUTED}x-cli is installed. To get started:${NC}"
echo -e ""
echo -e "  ${GREEN}x-cli${NC}                  ${MUTED}# launch in current directory${NC}"
echo -e ""
echo -e "${MUTED}Docs:    ${NC}https://github.com/${REPO}#readme"
echo -e "${MUTED}Issues:  ${NC}https://github.com/${REPO}/issues"
echo -e ""
