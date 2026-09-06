# Isolated PySpark judge — production execution boundary for P1.15
FROM eclipse-temurin:21-jre-jammy

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip \
  && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --uid 1001 --shell /usr/sbin/nologin judge

WORKDIR /judge
COPY requirements-judge.txt .
RUN pip3 install --no-cache-dir -r requirements-judge.txt

COPY judge_core.py run_judge.py worker.py ./

USER judge
ENV PYSPARK_PYTHON=python3
ENV JAVA_HOME=/opt/java/openjdk

ENTRYPOINT ["python3", "run_judge.py"]
